// src/server/api/routers/growth.ts

import { Gender, Prisma } from "@prisma/client";
// Import Prisma Client directly for model types, including the Gender enum if defined in schema.prisma
import { TRPCError } from "@trpc/server";
import { differenceInMonths } from "date-fns"; // For calculating age in months
import { z } from "zod";
// Import Z-score utility functions
import { calculateZScore, getAgeInDays } from "@/lib/zscoreCalc"; // Ensure this path is correct
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";

export const growthRouter = createTRPCRouter({
  /**
   * Creates a new growth measurement for a patient,
   * calculating and storing Z-scores for weight-for-age,
   * length/height-for-age, head circumference-for-age, and BMI-for-age.
   */
  createGrowthRecord: protectedProcedure
    .input(
      z.object({
        headCircumference: z.number().min(0).optional(), // in cm
        height: z.number().min(0), // in cm
        date: z.date(), // Date of measurement
        // Corrected Zod enum to allow both 'MALE' and 'FEMALE' as per Prisma Gender enum
        gender: z.enum([Gender.BOY, Gender.GIRL]), // Directly use Prisma's Gender enum values
        notes: z.string().optional(),
        patientId: z.string().min(1),
        weight: z.number().min(0), // in kg
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const {
          headCircumference,
          height,
          date,
          notes,
          patientId,
          weight,
          gender, // Get gender directly from input, which should match patient's gender
        } = input;

        // Fetch patient's date of birth from the database
        const patient = await ctx.db.patient.findUnique({
          select: {
            id: true,
            dateOfBirth: true,
            // No need to select gender here, as it's provided in the input,
            // but ensure the input gender matches the patient's actual gender if required by your logic.
          },
          where: { id: patientId },
        });

        if (!patient) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Patient not found.",
          });
        }

        // Calculate age in days and months from patient's birth date to measurement date
        const ageDays = getAgeInDays(patient.dateOfBirth, date);
        const ageMonths = differenceInMonths(date, patient.dateOfBirth);

        // Ensure measurement date isn't before birth date
        if (ageDays < 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Measurement date cannot be before patient's date of birth.",
          });
        }

        // Determine gender for Z-score calculation ('boys' or 'girls')
        // Your zscoreCalc functions likely expect 'boys'/'girls' strings
        const genderForZScore = gender === Gender.BOY ? "boys" : "girls";

        // Calculate Z-scores
        const weightForAgeZ = calculateZScore(
          "wfa", // Weight-for-age
          genderForZScore,
          ageDays,
          weight
        );
        const heightForAgeZ = calculateZScore(
          "lhfa", // Length/Height-for-age
          genderForZScore,
          ageDays,
          height
        );

        let hcForAgeZ: number | null = null;
        if (headCircumference !== undefined && headCircumference !== null) {
          hcForAgeZ = calculateZScore(
            "hcfa", // Head circumference-for-age
            genderForZScore,
            ageDays,
            headCircumference
          );
        }

        // Calculate BMI (weight in kg, height in cm - convert height to meters for BMI)
        const bmi = weight / (height / 100) ** 2; // Use Math.pow for clarity
        const bmiForAgeZ = calculateZScore(
          "bfa", // BMI-for-age
          genderForZScore,
          ageDays,
          bmi
        );

        // Create the new growth record in the database
        const newMeasurement = await ctx.db.growthRecord.create({
          data: {
            patient: { connect: { id: patientId } }, // Connect to existing patient
            date,
            gender, // Use the gender directly from input (which is Gender.MALE or Gender.FEMALE)
            ageDays,
            ageMonths,
            weight,
            height,
            headCircumference, // Can be null if optional input is not provided
            bmi, // Can be null if optional input is not provided or if bmi calculation is not robust
            weightForAgeZ,
            heightForAgeZ,
            bmiForAgeZ,
            hcForAgeZ, // Can be null if headCircumference was not provided
            notes,
            // createdAt and updatedAt are handled by Prisma's @default(now()) and @updatedAt
          },
        });

        return newMeasurement;
      } catch (error) {
        console.error("TRPC createGrowthRecord error:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        // Handle specific Prisma errors like P2002 for unique constraint violations
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          // Example: P2002 is a unique constraint violation
          if (error.code === "P2002") {
            throw new TRPCError({
              code: "CONFLICT",
              message: "A growth record for this patient on this date might already exist.",
              cause: error,
            });
          }
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Database error occurred: ${error.message} (Code: ${error.code})`,
            cause: error,
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create growth measurement.",
          cause: error, // Include the original error for debugging
        });
      }
    }),

  deleteGrowthMeasurement: protectedProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { id } = input;

        // Use findUniqueOrThrow for a more concise "not found" handling if the record might not exist
        const deletedMeasurement = await ctx.db.growthRecord.delete({
          where: { id: id },
          select: { id: true }, // Only select the ID of the deleted record
        });

        return { deletedId: deletedMeasurement.id, success: true };
      } catch (error) {
        console.error("TRPC deleteGrowthMeasurement error:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        // Prisma will throw a P2025 error if the record to be deleted is not found.
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Growth measurement with ID ${input.id} not found.`,
            cause: error,
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete growth measurement.",
          cause: error,
        });
      }
    }),

  /**
   * Retrieves a single growth measurement by its ID.
   */
  getGrowthMeasurementById: publicProcedure
    .input(z.object({ id: z.number().int() }))
    .query(async ({ ctx, input }) => {
      try {
        const { id } = input;
        // Prisma findFirst equivalent to Drizzle's findFirst with where
        const measurement = await ctx.db.growthRecord.findFirst({
          where: { id: id }, // Prisma uses object for 'where' clause
        });

        if (!measurement) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Growth measurement not found.",
          });
        }
        return measurement;
      } catch (error) {
        console.error("Error fetching growth measurement by ID:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch growth measurement.",
        });
      }
    }),

  /**
   * Retrieves all growth measurements for a specific patient, ordered by measurement date.
   */
  getGrowthMeasurementsByPatientId: publicProcedure
    .input(z.object({ patientId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      try {
        const { patientId } = input;
        // Prisma findMany equivalent to Drizzle's findMany with where and orderBy
        const measurements = await ctx.db.growthRecord.findMany({
          orderBy: { date: "asc" }, // Prisma uses object for 'orderBy'
          where: { patientId: patientId }, // Prisma uses object for 'where' clause
        });
        return measurements;
      } catch (error) {
        console.error("Error fetching growth measurements by patient ID:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch growth measurements.",
        });
      }
    }),

  /**
   * Deletes a growth measurement by its ID.
   */

  /**
   * Updates an existing growth measurement.
   * Recalculates Z-scores if weight, height, or head circumference are updated.
   */
  updategrowthRecord: protectedProcedure
    .input(
      z.object({
        id: z.number().int(),
        headCircumference: z.number().min(0).optional().nullable(),
        height: z.number().min(0).optional(),
        date: z.date().optional(),
        notes: z.string().optional().nullable(),
        weight: z.number().min(0).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, ...updateData } = input;

        const existingMeasurement = await ctx.db.growthRecord.findFirst({
          include: {
            patient: {
              select: {
                dateOfBirth: true,
                gender: true,
              },
            },
          },
          where: { id: id },
        });

        if (!existingMeasurement || !existingMeasurement.patient) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Growth measurement or associated patient not found.",
          });
        }

        // Use existing values if not provided in updateData.
        // Ensure values are numbers by providing a fallback of 0 if they become null.
        const currentWeight = updateData.weight ?? existingMeasurement.weight ?? 0;
        const currentHeight = updateData.height ?? existingMeasurement.height ?? 0;
        const currentdate = updateData.date ?? existingMeasurement.date;

        // Special handling for headCircumference as it can be null
        let currentHeadCircumference: number | null = null;
        if (updateData.headCircumference === null) {
          currentHeadCircumference = null; // Explicitly set to null if input is null
        } else if (updateData.headCircumference !== undefined) {
          currentHeadCircumference = updateData.headCircumference;
        } else {
          currentHeadCircumference = existingMeasurement.headCircumference;
        }

        // Now, pass *definite numbers* to calculateZScore and BMI formula.
        // If currentHeight or currentWeight could genuinely be 0 and lead to
        // division by zero or nonsensical Z-scores, your zscoreCalc should handle it,
        // or you should add a check here. Assuming 0 is a valid fallback for calculation.
        const patientGender =
          existingMeasurement.patient.gender.toLowerCase() === "male" ? "boys" : "girls";
        const ageInDays = getAgeInDays(existingMeasurement.patient.dateOfBirth, currentdate);

        const updatedWeightZScore = calculateZScore("wfa", patientGender, ageInDays, currentWeight);
        const updatedHeightZScore = calculateZScore(
          "lhfa",
          patientGender,
          ageInDays,
          currentHeight
        );

        let updatedHeadCircumferenceZScore: number | null = null;
        if (currentHeadCircumference !== null) {
          // Check for null explicitly
          updatedHeadCircumferenceZScore = calculateZScore(
            "hcfa",
            patientGender,
            ageInDays,
            currentHeadCircumference
          );
        }

        const updatedBmi =
          currentHeight > 0 ? currentWeight / ((currentHeight / 100) * (currentHeight / 100)) : 0; // Prevent division by zero
        const updatedBmiZScore = calculateZScore("bfa", patientGender, ageInDays, updatedBmi);

        const updatedResult = await ctx.db.growthRecord.update({
          data: {
            ...updateData,
            bmi: updatedBmi,
            bmiForAgeZ: updatedBmiZScore,
            headCircumference: currentHeadCircumference, // This can remain null
            hcForAgeZ: updatedHeadCircumferenceZScore, // This can remain null
            height: currentHeight,
            heightForAgeZ: updatedHeightZScore,
            updatedAt: new Date(),
            weight: currentWeight,
            weightForAgeZ: updatedWeightZScore,
          },
          where: { id: id },
        });

        return updatedResult;
      } catch (error) {
        console.error("Error updating growth measurement:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update growth measurement.",
        });
      }
    }),
});
