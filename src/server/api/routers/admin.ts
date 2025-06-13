import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { processAppointments } from "@/types/helper";
import { daysOfWeek } from "@/utils";

export const adminRouter = createTRPCRouter({
  getDashboardStats: protectedProcedure.query(async ({ ctx }) => {
    try {
      const todayDate = new Date().getDay();
      const today = daysOfWeek[todayDate] ?? "Sunday";

      // Run all queries in parallel
      const [totalPatientCount, totalDoctorsCount, allAppointments, availableDoctorsData] =
        await Promise.all([
          ctx.db.patient.count(),
          ctx.db.doctor.count(),
          ctx.db.appointment.findMany({
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
                  dateOfBirth: true,
                  firstName: true,
                  gender: true,
                  img: true,
                  lastName: true,
                },
              },
            },
            orderBy: {
              appointmentDate: "desc",
            },
          }),
          ctx.db.doctor.findMany({
            select: {
              id: true,
              colorCode: true,
              img: true,
              name: true,
              specialization: true,
            },
            take: 5,
            where: {
              workingDays: {
                some: {
                  day: today,
                },
              },
            },
          }),
        ]);

      const { appointmentCounts, monthlyData } = await processAppointments(allAppointments);
      const last5Records = allAppointments.slice(0, 5);

      return {
        appointmentCounts,
        availableDoctors: availableDoctorsData,
        last5Records,
        monthlyData,
        totalAppointments: allAppointments.length,
        totalDoctors: totalDoctorsCount,
        totalPatient: totalPatientCount,
      };
    } catch (error) {
      console.error("Error fetching admin dashboard stats:", error);
      throw new Error("Something went wrong while fetching dashboard statistics.");
    }
  }),

  getServices: protectedProcedure.query(async ({ ctx }) => {
    try {
      const data = await ctx.db.services.findMany({
        orderBy: {
          serviceName: "asc",
        },
      });

      if (!data || data.length === 0) {
        return {
          data: [],
          message: "No services found.",
        };
      }

      return { data };
    } catch (error) {
      console.error("Error fetching services:", error);
      throw new Error("Internal Server Error: Failed to fetch services.");
    }
  }),
});
