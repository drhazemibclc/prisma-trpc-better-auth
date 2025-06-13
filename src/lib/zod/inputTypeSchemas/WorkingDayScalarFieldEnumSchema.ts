import { z } from "zod";

export const WorkingDayScalarFieldEnumSchema = z.enum([
  "id",
  "doctorId",
  "day",
  "startTime",
  "closeTime",
  "createdAt",
  "updatedAt",
]);

export default WorkingDayScalarFieldEnumSchema;
