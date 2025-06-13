import { z } from "zod";

export const VitalSignScalarFieldEnumSchema = z.enum([
  "id",
  "patientId",
  "medicalRecordId",
  "bodyTemperature",
  "systolic",
  "diastolic",
  "heartRate",
  "respiratoryRate",
  "oxygenSaturation",
  "weight",
  "height",
  "headCircumference",
  "bmi",
  "nutritionalComment",
  "createdAt",
  "updatedAt",
]);

export default VitalSignScalarFieldEnumSchema;
