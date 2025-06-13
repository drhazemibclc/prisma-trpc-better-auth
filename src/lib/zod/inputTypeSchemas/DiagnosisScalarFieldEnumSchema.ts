import { z } from "zod";

export const DiagnosisScalarFieldEnumSchema = z.enum([
  "id",
  "patientId",
  "medicalRecordId",
  "doctorId",
  "symptoms",
  "diagnosisName",
  "notes",
  "prescribedMedications",
  "followUpPlan",
  "createdAt",
  "updatedAt",
]);

export default DiagnosisScalarFieldEnumSchema;
