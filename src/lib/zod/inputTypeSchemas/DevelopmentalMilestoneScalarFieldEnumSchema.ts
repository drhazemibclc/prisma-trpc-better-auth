import { z } from "zod";

export const DevelopmentalMilestoneScalarFieldEnumSchema = z.enum([
  "id",
  "patientId",
  "milestoneCategory",
  "milestoneDescription",
  "achievedDate",
  "notes",
  "assessedByDoctorId",
  "createdAt",
  "updatedAt",
]);

export default DevelopmentalMilestoneScalarFieldEnumSchema;
