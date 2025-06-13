import type { Prisma } from "@prisma/client";

import db from "@/lib/db";

// --- Response Interfaces ---
interface SuccessResponse<T> {
  data: T;
  status: number;
  success: true;
  message?: string;
}

interface ErrorResponse {
  message: string;
  status: number;
  success: false;
}

// --- Payload Types ---
type PatientAppointmentData = Prisma.AppointmentGetPayload<{
  select: {
    id: true;
    appointment_date: true;
    created_at: true;
    doctor: {
      select: {
        id: true;
        colorCode: true;
        img: true;
        name: true;
        specialization: true;
      };
    };
    doctor_id: true;
    note: true;
    patient: {
      select: {
        id: true;
        colorCode: true;
        date_of_birth: true;
        first_name: true;
        gender: true;
        img: true;
        last_name: true;
        phone: true;
      };
    };
    patient_id: true;
    reason: true;
    status: true;
    time: true;
    type: true;
    updated_at: true;
  };
}>;

type FullAppointmentDetails = Prisma.AppointmentGetPayload<{
  include: {
    bills: true;
    doctor: true;
    medical: {
      include: {
        diagnosis: true;
        lab_test: true;
        vital_signs: true;
      };
    };
    patient: true;
  };
}>;

// --- Utility: Build Query ---
const buildQuery = (id?: string, search?: string): Prisma.AppointmentWhereInput => {
  const conditions: Prisma.AppointmentWhereInput[] = [];

  if (search?.trim()) {
    conditions.push({
      OR: [
        { patient: { first_name: { contains: search, mode: "insensitive" } } },
        { patient: { last_name: { contains: search, mode: "insensitive" } } },
        { doctor: { name: { contains: search, mode: "insensitive" } } },
      ],
    });
  }

  if (id?.trim()) {
    conditions.push({
      OR: [{ patient_id: id }, { doctor_id: id }],
    });
  }

  return conditions.length > 0 ? { AND: conditions } : {};
};

// --- Get Appointment By ID ---
export async function getAppointmentById(id: number): Promise<
  | ErrorResponse
  | SuccessResponse<
      Prisma.AppointmentGetPayload<{
        include: {
          doctor: {
            select: {
              id: true;
              img: true;
              name: true;
              specialization: true;
            };
          };
          patient: {
            select: {
              id: true;
              address: true;
              date_of_birth: true;
              first_name: true;
              gender: true;
              img: true;
              last_name: true;
              phone: true;
            };
          };
        };
      }>
    >
> {
  try {
    if (!id || Number.isNaN(id) || id <= 0) {
      return {
        message: "Invalid appointment ID.",
        status: 400,
        success: false,
      };
    }

    const data = await db.appointment.findUnique({
      include: {
        doctor: {
          select: { id: true, img: true, name: true, specialization: true },
        },
        patient: {
          select: {
            id: true,
            address: true,
            date_of_birth: true,
            first_name: true,
            gender: true,
            img: true,
            last_name: true,
            phone: true,
          },
        },
      },
      where: { id },
    });

    if (!data) {
      return {
        message: "Appointment not found.",
        status: 404,
        success: false,
      };
    }

    return { data, status: 200, success: true };
  } catch (error) {
    console.error("getAppointmentById error:", error);
    return { message: "Internal Server Error", status: 500, success: false };
  }
}

// --- Get Appointments for Patient or Doctor with Pagination ---
interface AllAppointmentsProps {
  id?: string;
  limit?: number | string;
  page?: number | string;
  search?: string;
}

export async function getPatientAppointments({
  id,
  limit = 10,
  page = 1,
  search,
}: AllAppointmentsProps): Promise<
  | ErrorResponse
  | SuccessResponse<{
      currentPage: number;
      data: PatientAppointmentData[];
      totalPages: number;
      totalRecord: number;
    }>
> {
  try {
    const PAGE_NUMBER = Math.max(Number(page) || 1, 1);
    const LIMIT = Math.max(Number(limit) || 10, 1);
    const SKIP = (PAGE_NUMBER - 1) * LIMIT;

    const query = buildQuery(id, search);

    const [data, totalRecord] = await Promise.all([
      db.appointment.findMany({
        orderBy: { appointment_date: "desc" },
        select: {
          id: true,
          appointment_date: true,
          created_at: true,
          doctor: {
            select: {
              id: true,
              colorCode: true,
              img: true,
              name: true,
              specialization: true,
            },
          },
          doctor_id: true,
          note: true,
          patient: {
            select: {
              id: true,
              colorCode: true,
              date_of_birth: true,
              first_name: true,
              gender: true,
              img: true,
              last_name: true,
              phone: true,
            },
          },
          patient_id: true,
          reason: true,
          status: true,
          time: true,
          type: true,
          updated_at: true,
        },
        skip: SKIP,
        take: LIMIT,
        where: query,
      }),
      db.appointment.count({ where: query }),
    ]);

    return {
      data: {
        currentPage: PAGE_NUMBER,
        data,
        totalPages: Math.ceil(totalRecord / LIMIT),
        totalRecord,
      },
      status: 200,
      success: true,
    };
  } catch (error) {
    console.error("getPatientAppointments error:", error);
    return { message: "Internal Server Error", status: 500, success: false };
  }
}

// --- Get Appointment + Medical Records ---
export async function getAppointmentWithMedicalRecordsById(
  id: number
): Promise<ErrorResponse | SuccessResponse<FullAppointmentDetails>> {
  try {
    if (!id || Number.isNaN(id) || id <= 0) {
      return {
        message: "Invalid appointment ID.",
        status: 400,
        success: false,
      };
    }

    const data = await db.appointment.findUnique({
      include: {
        bills: true,
        doctor: true,
        medical: {
          include: {
            diagnosis: true,
            lab_test: true,
            vital_signs: true,
          },
        },
        patient: true,
      },
      where: { id },
    });

    if (!data) {
      return {
        message: "Appointment data not found.",
        status: 404,
        success: false,
      };
    }

    return { data, status: 200, success: true };
  } catch (error) {
    console.error("getAppointmentWithMedicalRecordsById error:", error);
    return { message: "Internal Server Error", status: 500, success: false };
  }
}
