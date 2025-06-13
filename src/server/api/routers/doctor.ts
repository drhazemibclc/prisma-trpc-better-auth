// src/server/api/routers/doctor.ts

// --- Import Prisma Models ---
// Standard import for Prisma Client types.
import type { Prisma } from "@prisma/client";

import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { processAppointments } from "@/types/helper"; // Ensure this is compatible with Prisma's Appointment type
import { daysOfWeek } from "@/utils"; // Assuming daysOfWeek is here and maps 0-6 to string names

// --- Helper for Prisma Where Clause (Doctors) ---
// This builds a Prisma-compatible 'where' object for the doctors query.
const buildDoctorWhereClause = (search?: string): Prisma.DoctorWhereInput | undefined => {
  if (search?.trim()) {
    return {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { specialization: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        // Add other searchable fields as needed, e.g., phone, address
      ],
    };
  }
  return undefined;
};

export const doctorRouter = createTRPCRouter({
  // --- getAllDoctors ---
  // Retrieves a paginated list of all doctors, with optional search functionality.
  getAllDoctors: publicProcedure
    .input(
      z
        .object({
          limit: z
            .union([
              z.number().int().min(1),
              z
                .string()
                .regex(/^\d+$/)
                .transform(Number), // Allow string numbers, transform to number
            ])
            .optional()
            .default(10), // Set default for `limit` directly in schema
          page: z
            .union([z.number().int().min(1), z.string().regex(/^\d+$/).transform(Number)])
            .default(1), // Set default for `page` directly in schema
          search: z.string().optional(),
        })
        .optional()
        .default({}) // Default for the whole input object to handle optional `input` gracefully
    )
    .query(async ({ ctx, input }) => {
      try {
        const { page, limit, search } = input;
        const skip = (page - 1) * limit;

        const whereClause = buildDoctorWhereClause(search);

        // Use Promise.all for concurrent fetching of doctors and total count
        const [fetchedDoctors, totalRecordsCount] = await Promise.all([
          ctx.db.doctor.findMany({
            include: { workingDays: true }, // Include related workingDays data
            orderBy: { name: "asc" }, // Order by doctor name alphabetically
            skip: skip, // Apply pagination offset
            take: limit, // Apply pagination limit
            where: whereClause, // Apply search filter
          }),
          ctx.db.doctor.count({
            where: whereClause, // Apply search filter to count as well
          }),
        ]);

        const totalPages = Math.ceil(totalRecordsCount / limit);

        return {
          currentPage: page,
          data: fetchedDoctors,
          totalPages,
          totalRecords: totalRecordsCount,
        };
      } catch (error) {
        console.error("TRPC getAllDoctors error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch doctors list. Please try again.",
          cause: error,
        });
      }
    }),

  // Retrieves a list of doctors who are currently available based on their working days and status.
  getAvailableDoctors: publicProcedure.query(async ({ ctx }) => {
    try {
      const todayDate = new Date().getDay(); // Get current day of week (0-6)
      const today = daysOfWeek[todayDate]; // Map to string (e.g., 'Monday')

      // Ensure `today` is a valid day string from your `daysOfWeek` mapping
      if (!today) {
        console.warn(`Could not determine day of week for index: ${todayDate}`);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to determine current day for doctor availability.",
        });
      }

      const availableDoctorsData = await ctx.db.doctor.findMany({
        select: {
          id: true,
          colorCode: true,
          img: true,
          name: true,
          specialization: true,
        },
        take: 3, // Limit to 3 available doctors
        where: {
          // Assuming 'AVAILABLE' is a string literal or enum value in your Doctor model
          availabilityStatus: "AVAILABLE",
          workingDays: {
            some: {
              // Check if at least one working day record matches 'today'
              day: today,
            },
          },
        },
        orderBy: { name: "asc" }, // Order for consistent results
      });

      return { data: availableDoctorsData };
    } catch (error) {
      console.error("TRPC getAvailableDoctors error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch available doctors. Please try again.",
        cause: error,
      });
    }
  }),

  // Retrieves detailed information for a single doctor by ID, including their recent appointments and total count.
  getById: publicProcedure
    .input(z.object({ id: z.string().min(1) })) // Doctor ID as a string
    .query(async ({ ctx, input }) => {
      try {
        const { id } = input;

        // Use ctx.db.$transaction for atomic operations, ensuring both queries use the transactional client
        const [doctorData, totalAppointmentCount] = await ctx.db.$transaction(async (prisma) => {
          const doctorQueryResult = await prisma.doctor.findUnique({
            include: {
              // Fetch doctor details, recent appointments, and working days
              appointments: {
                include: {
                  // Include patient details for each appointment
                  patient: {
                    select: {
                      id: true,
                      colorCode: true,
                      firstName: true,
                      gender: true,
                      img: true,
                      lastName: true,
                    },
                  },
                },
                orderBy: { appointmentDate: "desc" }, // Order by most recent appointments
                take: 10, // Get the 10 most recent appointments
              },
              workingDays: true, // Include the doctor's working days
            },
            where: { id: id }, // Find doctor by ID
          });

          // Get the total count of appointments for this specific doctor
          const appointmentCountResult = await prisma.appointment.count({
            where: { doctorId: id },
          });

          return [doctorQueryResult, appointmentCountResult];
        });

        if (!doctorData) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Doctor with ID ${id} not found.`,
          });
        }

        return {
          data: doctorData,
          totalAppointment: totalAppointmentCount,
        };
      } catch (error) {
        console.error("TRPC getDoctorById error:", error);
        if (error instanceof TRPCError) throw error; // Re-throw TRPCError if it's already one
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch doctor details. Please try again.",
          cause: error,
        });
      }
    }),

  // Retrieves dashboard statistics specific to the authenticated doctor.
  // Requires authentication.
  getDashboardStats: protectedProcedure.query(async ({ ctx }) => {
    try {
      const userId = ctx.session?.user.id;
      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated or session invalid.",
        });
      }

      // Use ctx.db.$transaction for atomic operations, ensuring all queries use the transactional client
      const [totalPatientCount, totalNursesCount, allAppointments, availableDoctorsData] =
        await ctx.db.$transaction(async (prisma) => {
          // Count all patients
          const patientCount = await prisma.patient.count();

          // Count all staff with the role 'NURSE'
          const nursesCount = await prisma.staff.count({
            where: { role: "NURSE" }, // Assuming 'role' is a string or enum in your Staff model
          });

          // Fetch appointments relevant to the current doctor
          const appointmentsResult = await prisma.appointment.findMany({
            include: {
              // No need to include `doctor` here as we're filtering by `doctorId`
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
              appointmentDate: "desc", // Order by most recent appointments first
            },
            where: {
              doctorId: userId, // Filter appointments for the current doctor
              appointmentDate: {
                lte: new Date(), // Filter for appointments up to and including the current date (past/present)
              },
            },
          });

          // Get today's day for available doctors
          const todayDate = new Date().getDay();
          const today = daysOfWeek[todayDate];

          if (!today) {
            console.warn(`Could not determine day of week for index: ${todayDate}`);
            // Decide how to handle this gracefully if daysOfWeek is not exhaustive
          }

          // Fetch available doctors based on today's working day and availability status
          const doctorsResult = await prisma.doctor.findMany({
            select: {
              id: true,
              colorCode: true,
              img: true,
              name: true,
              specialization: true,
            },
            take: 5, // Limit to 5 available doctors
            where: {
              availabilityStatus: "AVAILABLE", // Assuming 'AVAILABLE' is an enum value (e.g., DoctorStatus.AVAILABLE)
              workingDays: {
                some: {
                  // Check if AT LEAST ONE working day record matches 'today'
                  day: today,
                },
              },
            },
            orderBy: { name: "asc" }, // Order for consistent results
          });

          return [patientCount, nursesCount, appointmentsResult, doctorsResult];
        });

      // Process appointments (assuming `processAppointments` is compatible with Prisma results)
      // This helper function should handle the necessary data transformations.
      const { appointmentCounts, monthlyData } = await processAppointments(allAppointments);

      const last5Records = allAppointments.slice(0, 5); // Take the 5 most recent appointments

      return {
        appointmentCounts,
        availableDoctors: availableDoctorsData,
        last5Records,
        monthlyData,
        totalAppointments: allAppointments.length, // Corrected from `totalAppointment`
        totalNurses: totalNursesCount,
        totalPatient: totalPatientCount,
      };
    } catch (error) {
      console.error("TRPC getDoctorDashboardStats error:", error);
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch doctor dashboard statistics. Please try again.",
        cause: error,
      });
    }
  }),

  // Retrieves ratings for a specific staff/doctor ID, including patient names.
  getRatingsById: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      try {
        const { id } = input;
        const ratingsData = await ctx.db.rating.findMany({
          include: {
            patient: {
              select: { firstName: true, lastName: true }, // Select specific patient fields
            },
          },
          where: { staffId: id }, // Assuming staffId is the foreign key for the doctor/staff
        });

        const totalRatings = ratingsData.length; // `.length` is safe here
        const sumRatings = ratingsData.reduce((sum, el) => sum + el.rating, 0);
        const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;
        const formattedAverageRating = (Math.round(averageRating * 10) / 10).toFixed(1);

        return {
          averageRating: formattedAverageRating,
          ratings: ratingsData,
          totalRatings,
        };
      } catch (error) {
        console.error("TRPC getRatingsById error:", error);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch ratings. Please try again.",
          cause: error,
        });
      }
    }),
});
