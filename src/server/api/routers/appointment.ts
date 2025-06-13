import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc"; // Adjust path to your tRPC context
import type { Prisma } from "../../../../prisma/generated";

// --- Prisma Type Inferences ---
// These types infer the exact shape of the data returned by Prisma queries with specific `include`/`select` clauses.

// Type for simplified appointment data with selected doctor and patient fields
type PatientAppointmentData = Prisma.AppointmentGetPayload<{
  include: {
    doctor: {
      select: {
        id: true;
        colorCode: true;
        img: true;
        name: true;
        specialization: true;
      };
    };
    patient: {
      select: {
        id: true;
        colorCode: true;
        dateOfBirth: true;
        firstName: true;
        gender: true;
        img: true;
        lastName: true;
        phone: true; // Added phone as it was in `getAppointments` query
      };
    };
  };
}>;

// Type for a full appointment details including related medical records and payments
type FullAppointmentDetails = Prisma.AppointmentGetPayload<{
  include: {
    doctor: true; // Includes all doctor fields
    medicalRecord: {
      // Assuming 'medicalRecord' is the relation name to a single record (singular)
      include: {
        diagnosis: true; // Assuming 'diagnosis' is the relation name to a single record
        labTests: true; // Assuming 'labTests' is the relation name to multiple records
        vitalSigns: true; // Assuming 'vitalSigns' is the relation name to multiple records
      };
    };
    patient: true; // Includes all patient fields
    payments: true; // Assuming your Prisma schema calls the relation 'payments' (plural for one-to-many)
  };
}>;

// --- Utility: Build Query (Prisma compatible) ---
// This function constructs a Prisma-compatible 'where' object for filtering appointments.
const buildAppointmentWhereClause = (
  id?: string,
  search?: string
): Prisma.AppointmentWhereInput | undefined => {
  const conditions: Prisma.AppointmentWhereInput[] = [];

  if (search?.trim()) {
    conditions.push({
      OR: [
        // Case-insensitive search on patient first name, last name, or doctor name
        { patient: { firstName: { contains: search, mode: "insensitive" } } },
        { patient: { lastName: { contains: search, mode: "insensitive" } } },
        { doctor: { name: { contains: search, mode: "insensitive" } } },
      ],
    });
  }

  if (id?.trim()) {
    conditions.push({
      OR: [
        // Filter by patientId or doctorId if provided
        { patientId: id },
        { doctorId: id },
      ],
    });
  }

  // Combine multiple conditions with 'AND', or return undefined if no conditions
  return conditions.length > 0 ? { AND: conditions } : undefined;
};

export const appointmentRouter = createTRPCRouter({
  // --- getAppointments ---
  // Retrieves a paginated list of appointments, with optional filtering by ID or search term.
  // Requires authentication.
  getAppointments: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1).optional(), // Optional ID to filter by patientId or doctorId
        limit: z.number().int().min(1).default(10), // Number of records per page
        page: z.number().int().min(1).default(1), // Current page number
        search: z.string().optional(), // Optional search term for patient/doctor names
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const { id, limit, page, search } = input;
        const skip = (page - 1) * limit; // Calculate offset for pagination
        const where = buildAppointmentWhereClause(id, search); // Build dynamic WHERE clause

        // Execute both the data fetch and count query concurrently for efficiency
        const [appointments, totalCount] = await Promise.all([
          ctx.db.appointment.findMany({
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
                  id: true,
                  colorCode: true,
                  dateOfBirth: true,
                  firstName: true,
                  gender: true,
                  img: true,
                  lastName: true,
                  phone: true,
                },
              },
            },
            orderBy: { appointmentDate: "desc" }, // Order by most recent appointments
            skip, // Apply pagination offset
            take: limit, // Apply pagination limit
            where, // Apply search/ID filters
          }),
          ctx.db.appointment.count({ where }), // Get total count of matching records
        ]);

        // Return paginated data and metadata
        return {
          currentPage: page,
          data: appointments as PatientAppointmentData[], // Assert type for clarity
          totalPages: Math.ceil(totalCount / limit),
          totalRecords: totalCount, // Changed `totalRecord` to `totalRecords` for consistency
        };
      } catch (error) {
        console.error("TRPC getAppointments error:", error);
        // Throw a TRPCError for structured error handling on the client
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch appointments. Please try again.",
          cause: error, // Include the original error for debugging purposes (optional)
        });
      }
    }),

  // --- getAppointmentById ---
  // Retrieves a single appointment by its ID, with selected doctor and patient details.
  // Publicly accessible.
  getById: publicProcedure
    .input(z.object({ id: z.number().int().positive() })) // Validate ID as a positive integer
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.appointment.findFirst({
          include: {
            doctor: {
              select: {
                id: true,
                img: true,
                name: true,
                specialization: true,
              },
            },
            patient: {
              select: {
                id: true,
                address: true,
                dateOfBirth: true,
                firstName: true,
                gender: true,
                img: true,
                lastName: true,
                phone: true,
              },
            },
          },
          where: { id: input.id }, // Find by the provided ID
        });

        if (!data) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Appointment with ID ${input.id} not found.`, // More specific message
          });
        }

        return { data };
      } catch (error) {
        console.error("TRPC getAppointmentById error:", error);
        // If it's already a TRPCError, re-throw it. Otherwise, wrap in INTERNAL_SERVER_ERROR.
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch appointment details. Please try again.",
          cause: error,
        });
      }
    }),

  // --- getAppointmentWithMedicalRecordsById ---
  // Retrieves a single appointment by ID, including comprehensive medical record and payment details.
  // Publicly accessible (consider if this should be protected based on your app's security model).
  getWithMedicalRecordsById: publicProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.appointment.findFirst({
          include: {
            doctor: true, // Include all doctor fields
            medical: {
              // Assuming 'medicalRecord' is the relation name to a single record (singular)
              include: {
                diagnosis: true, // Assuming 'diagnosis' is singular (one diagnosis per record)
                labTest: true, // Assuming 'labTests' is plural (multiple lab tests per record)
                vitalSigns: true, // Assuming 'vitalSigns' is plural (multiple vital signs per record)
              },
            },
            patient: true, // Include all patient fields
            bills: true, // Assuming 'payments' is plural (multiple payments per appointment)
          },
          where: { id: input.id },
        });

        if (!data) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Appointment with medical records and ID ${input.id} not found.`,
          });
        }

        // Cast to FullAppointmentDetails for strict type checking.
        // This assertion is safe if your Prisma schema truly matches the type.
        return { data: data as unknown as FullAppointmentDetails };
      } catch (error) {
        console.error("TRPC getWithMedicalRecordsById error:", error);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch appointment with medical records. Please try again.",
          cause: error,
        });
      }
    }),
});
