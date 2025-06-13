import db from "@/lib/db";

import { daysOfWeek } from "..";
import { processAppointments } from "./patient";

export async function getAdminDashboardStats() {
  try {
    const todayDate = new Date().getDay();
    const today = daysOfWeek[todayDate];

    const [totalPatient, totalDoctors, appointments, doctors] = await Promise.all([
      db.patient.count(),
      db.doctor.count(),
      db.appointment.findMany({
        include: {
          doctor: {
            select: {
              colorCode: true,
              img: true,
              name: true,
              specialization: true,
            },
          },
          patient: {
            select: {
              id: true,
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
      }),
      db.doctor.findMany({
        select: {
          id: true,
          colorCode: true,
          img: true,
          name: true,
          specialization: true,
        },
        take: 5,
        where: {
          working_days: {
            some: { day: { equals: today, mode: "insensitive" } },
          },
        },
      }),
    ]);

    const { appointmentCounts, monthlyData } = await processAppointments(appointments);

    const last5Records = appointments.slice(0, 5);

    return {
      appointmentCounts,
      availableDoctors: doctors,
      last5Records,
      monthlyData,
      status: 200,
      success: true,
      totalAppointments: appointments.length,
      totalDoctors,
      totalPatient,
    };
  } catch (error) {
    console.log(error);

    return { error: true, message: "Something went wrong" };
  }
}

export async function getServices() {
  try {
    const data = await db.services.findMany({
      orderBy: { service_name: "asc" },
    });

    if (!data) {
      return {
        data: [],
        message: "Data not found",
        status: 404,
        success: false,
      };
    }

    return {
      data,
      success: true,
    };
  } catch (error) {
    console.log(error);
    return { message: "Internal Server Error", status: 500, success: false };
  }
}
