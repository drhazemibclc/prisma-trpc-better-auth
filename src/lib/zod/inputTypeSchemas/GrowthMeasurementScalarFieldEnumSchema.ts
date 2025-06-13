import { z } from "zod";

export const GrowthMeasurementScalarFieldEnumSchema = z.enum([
  "id",
  "patientId",
  "gender",
  "ageInDays",
  "measurementDate",
  "weightKg",
  "heightCm",
  "headCircumferenceCm",
  "bmi",
  "weightZScore",
  "heightZScore",
  "headCircumferenceZScore",
  "bmiZScore",
  "notes",
  "createdAt",
  "updatedAt",
]);

export default GrowthMeasurementScalarFieldEnumSchema;
