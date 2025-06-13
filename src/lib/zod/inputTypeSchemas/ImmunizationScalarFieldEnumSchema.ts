import { z } from "zod";

export const ImmunizationScalarFieldEnumSchema = z.enum([
  "id",
  "patientId",
  "vaccineName",
  "doseNumber",
  "administrationDate",
  "nextDoseDate",
  "status",
  "administeredByDoctorId",
  "batchNumber",
  "notes",
  "createdAt",
  "updatedAt",
]);

export default ImmunizationScalarFieldEnumSchema;
