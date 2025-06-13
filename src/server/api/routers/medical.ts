// Import Prisma types, and specifically the GetPayload type for precise inference
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { format } from "date-fns";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

// --- Type Definitions for Processed Data ---
// (Keep these as they define your output shape for charts)
interface FormattedVitalSignData {
  label: string;
  bodyTemperature: number;
  weight: number;
  height: number;
}

interface FormattedHeartRateData {
  label: string;
  minHeartRate: number;
  maxHeartRate: number;
}

// --- Define the exact type of the data returned by YOUR SPECIFIC findMany with select ---
type VitalSignsQueryPayload = Prisma.VitalSignsGetPayload<{
  select: {
    createdAt: true;
    patientId: true; // Include patientId if you want it in the returned data, though not used after filter
    bodyTemperature: true;
    heartRate: true;
    weight: true;
    height: true;
  };
}>;

export const medicalRouter = createTRPCRouter({
  // --- getVitalSignData ---
  // Fetches and processes vital signs data for a specific patient over the last 7 days.
  getVitalSignData: publicProcedure
    .input(z.object({ id: z.string().min(1, "Patient ID is required.") }))
    .query(async ({ ctx, input }) => {
      try {
        const { id: patientId } = input; // Renamed to patientId for clarity

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0); // Normalize to start of the day

        // Fetch vital signs data for the specified patient from the last 7 days
        const data: VitalSignsQueryPayload[] = await ctx.db.vitalSigns.findMany({
          orderBy: {
            createdAt: "asc",
          },
          select: {
            // These are the fields you explicitly asked for
            patientId: true,
            createdAt: true,
            bodyTemperature: true,
            heartRate: true,
            weight: true,
            height: true,
          },
          where: {
            patientId: patientId,
            createdAt: {
              gte: sevenDaysAgo,
            },
          },
        });

        if (data.length === 0) {
          return {
            averageBodyTemperature: "N/A",
            averageHeartRate: "N/A",
            averageWeight: "N/A",
            averageHeight: "N/A",
            vitalSignsChartData: [],
            heartRateChartData: [],
          };
        }

        const vitalSignsChartData: FormattedVitalSignData[] = data.map((record) => ({
          label: format(record.createdAt, "MMM d, h:mm a"), // Added time for more precision
          bodyTemperature: record.bodyTemperature,
          weight: record.weight,
          height: record.height,
        }));

        const heartRateChartData: FormattedHeartRateData[] = data.map((record) => {
          const heartRateString = record.heartRate?.toString().trim() ?? "";
          const heartRates = heartRateString
            .split("-")
            .map((rate) => Number.parseInt(rate.trim()))
            .filter((rate) => !Number.isNaN(rate));

          const minHeartRate = heartRates[0] ?? 0;
          const maxHeartRate = heartRates.length > 1 ? (heartRates[1] ?? 0) : minHeartRate;

          return {
            label: format(record.createdAt, "MMM d, h:mm a"), // Added time for more precision
            minHeartRate,
            maxHeartRate,
          };
        });

        // --- Calculate Averages ---
        const totalBodyTemperature = data.reduce((sum, record) => sum + record.bodyTemperature, 0);
        const totalWeight = data.reduce((sum, record) => sum + record.weight, 0);
        const totalHeight = data.reduce((sum, record) => sum + record.height, 0);

        const totalMinHeartRate = heartRateChartData.reduce(
          (sum, record) => sum + record.minHeartRate,
          0
        );
        const totalMaxHeartRate = heartRateChartData.reduce(
          (sum, record) => sum + record.maxHeartRate,
          0
        );

        const count = data.length;

        const averageBodyTemperature = count > 0 ? totalBodyTemperature / count : 0;
        const averageWeight = count > 0 ? totalWeight / count : 0;
        const averageHeight = count > 0 ? totalHeight / count : 0;
        const averageMinHeartRate = count > 0 ? totalMinHeartRate / count : 0;
        const averageMaxHeartRate = count > 0 ? totalMaxHeartRate / count : 0;

        const formattedAverageBodyTemperature = `${averageBodyTemperature.toFixed(2)} °C`;
        const formattedAverageWeight = `${averageWeight.toFixed(2)} kg`;
        const formattedAverageHeight = `${averageHeight.toFixed(2)} cm`;
        const formattedAverageHeartRate = `${averageMinHeartRate.toFixed(2)}-${averageMaxHeartRate.toFixed(2)} bpm`;

        return {
          averageBodyTemperature: formattedAverageBodyTemperature,
          averageHeartRate: formattedAverageHeartRate,
          averageWeight: formattedAverageWeight,
          averageHeight: formattedAverageHeight,
          vitalSignsChartData,
          heartRateChartData,
        };
      } catch (error) {
        console.error("TRPC getVitalSignData error:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Database error occurred while fetching vital signs (Code: ${error.code}).`,
            cause: error,
          });
        }
        if (error instanceof Prisma.PrismaClientValidationError) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Invalid query to database: ${error.message}`,
            cause: error,
          });
        }
        if (error instanceof Error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `An unexpected server error occurred: ${error.message}`,
            cause: error,
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unknown error occurred while fetching vital signs.",
          cause: error,
        });
      }
    }),
});
