import { endOfMonth, format, getMonth, startOfYear } from "date-fns";

import db from "@/lib/db";

import { daysOfWeek } from "..";

type AppointmentStatus = "CANCELLED" | "COMPLETED" | "PENDING" | "SCHEDULED";

interface Appointment {
  appointment_date: Date;
  status: AppointmentStatus;
}

function isValidStatus(status: string): status is AppointmentStatus {
  return ["CANCELLED", "COMPLETED", "PENDING", "SCHEDULED"].includes(status);
}

const initializeMonthlyData = () => {
  const this_year = new Date().getFullYear();

  const months = Array.from({ length: getMonth(new Date()) + 1 }, (_, index) => ({
    appointment: 0,
    completed: 0,
    name: format(new Date(this_year, index), "MMM"),
  }));
  return months;
};

export const processAppointments = async (appointments: Appointment[]) => {
  const monthlyData = initializeMonthlyData();

  const appointmentCounts = appointments.reduce<Record<AppointmentStatus, number>>(
    (acc, appointment) => {
      const status = appointment.status;

      const appointmentDate = appointment?.appointment_date;

      const monthIndex = getMonth(appointmentDate);

      if (appointmentDate >= startOfYear(new Date()) && appointmentDate <= endOfMonth(new Date())) {
        monthlyData[monthIndex].appointment += 1;

        if (status === "COMPLETED") {
          monthlyData[monthIndex].completed += 1;
        }
      }

      // Grouping by status
      if (isValidStatus(status)) {
        acc[status] = (acc[status] || 0) + 1;
      }

      return acc;
    },
    {
      CANCELLED: 0,
      COMPLETED: 0,
      PENDING: 0,
      SCHEDULED: 0,
    }
  );

  return { appointmentCounts, monthlyData };
};

export async function getPatientDashboardStatistics(id: string) {
  try {
    if (!id) {
      return {
        data: null,
        message: "No data found",
        success: false,
      };
    }

    const data = await db.patient.findUnique({
      select: {
        id: true,
        colorCode: true,
        first_name: true,
        gender: true,
        img: true,
        last_name: true,
      },
      where: { id },
    });

    if (!data) {
      return {
        data: null,
        message: "Patient data not found",
        status: 200,
        success: false,
      };
    }

    const appointments = await db.appointment.findMany({
      include: {
        doctor: {
          select: {
            id: true,
            colorCode: true,
            img: true,
            name: true,
            specialization: true,
          },
        },
        patient: {
          select: {
            colorCode: true,
            date_of_birth: true,
            first_name: true,
            gender: true,
            img: true,
            last_name: true,
          },
        },
      },
      orderBy: { appointment_date: "desc" },

      where: { patient_id: data?.id },
    });

    const { appointmentCounts, monthlyData } = await processAppointments(appointments);
    const last5Records = appointments.slice(0, 5);

    const today = daysOfWeek[new Date().getDay()];

    const availableDoctor = await db.doctor.findMany({
      select: {
        id: true,
        colorCode: true,
        img: true,
        name: true,
        specialization: true,
        working_days: true,
      },
      take: 4,
      where: {
        working_days: {
          some: {
            day: {
              equals: today,
              mode: "insensitive",
            },
          },
        },
      },
    });

    return {
      appointmentCounts,
      availableDoctor,
      data,
      last5Records,
      monthlyData,
      status: 200,
      success: true,
      totalAppointments: appointments.length,
    };
  } catch (error) {
    console.log(error);
    return { message: "Internal Server Error", status: 500, success: false };
  }
}

export async function getPatientById(id: string) {
  try {
    const patient = await db.patient.findUnique({
      where: { id },
    });

    if (!patient) {
      return {
        data: null,
        message: "Patient data not found",
        status: 200,
        success: false,
      };
    }

    return { data: patient, status: 200, success: true };
  } catch (error) {
    console.log(error);
    return { message: "Internal Server Error", status: 500, success: false };
  }
}

export async function getPatientFullDataById(id: string) {
  try {
    const patient = await db.patient.findFirst({
      include: {
        _count: {
          select: {
            appointments: true,
          },
        },
        appointments: {
          orderBy: {
            appointment_date: "desc",
          },
          select: {
            appointment_date: true,
          },
          take: 1,
        },
      },
      where: {
        OR: [
          {
            id,
          },
          { email: id },
        ],
      },
    });

    if (!patient) {
      return {
        message: "Patient data not found",
        status: 404,
        success: false,
      };
    }
    const lastVisit = patient.appointments[0]?.appointment_date || null;

    return {
      data: {
        ...patient,
        lastVisit,
        totalAppointments: patient._count.appointments,
      },
      status: 200,
      success: true,
    };
  } catch (error) {
    console.log(error);
    return { message: "Internal Server Error", status: 500, success: false };
  }
}

export async function getAllPatients({
  limit,
  page,
  search,
}: {
  page: number | string;
  limit?: number | string;
  search?: string;
}) {
  try {
    const PAGE_NUMBER = Number(page) <= 0 ? 1 : Number(page);
    const LIMIT = Number(limit) || 10;

    const SKIP = (PAGE_NUMBER - 1) * LIMIT;

    const [patients, totalRecords] = await Promise.all([
      db.patient.findMany({
        include: {
          appointments: {
            orderBy: { appointment_date: "desc" },
            select: {
              medical: {
                orderBy: { created_at: "desc" },
                select: { created_at: true, treatment_plan: true },
                take: 1,
              },
            },
            take: 1,
          },
        },
        orderBy: { first_name: "asc" },
        skip: SKIP,
        take: LIMIT,
        where: {
          OR: [
            { first_name: { contains: search, mode: "insensitive" } },
            { last_name: { contains: search, mode: "insensitive" } },
            { phone: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        },
      }),
      db.patient.count(),
    ]);

    const totalPages = Math.ceil(totalRecords / LIMIT);

    return {
      currentPage: PAGE_NUMBER,
      data: patients,
      status: 200,
      success: true,
      totalPages,
      totalRecords,
    };
  } catch (error) {
    console.log(error);
    return { message: "Internal Server Error", status: 500, success: false };
  }
}
