import { z } from "zod";

export const MedicalRecordScalarFieldEnumSchema = z.enum([
  "id",
  "patientId",
  "appointmentId",
  "doctorId",
  "treatmentPlan",
  "prescriptions",
  "labRequest",
  "notes",
  "chiefComplaint",
  "hpi",
  "ros",
  "physicalExam",
  "assessment",
  "createdAt",
  "updatedAt",
]);

export default MedicalRecordScalarFieldEnumSchema;
