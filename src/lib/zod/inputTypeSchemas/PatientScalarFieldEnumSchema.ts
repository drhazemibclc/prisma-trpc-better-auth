import { z } from "zod";

export const PatientScalarFieldEnumSchema = z.enum([
  "id",
  "firstName",
  "lastName",
  "dateOfBirth",
  "gender",
  "phone",
  "email",
  "parentGuardianName",
  "parentGuardianPhone",
  "parentGuardianEmail",
  "relationToPatient",
  "address",
  "emergencyContactName",
  "emergencyContactNumber",
  "relationToEmergency",
  "bloodGroup",
  "allergies",
  "medicalConditions",
  "medicalHistory",
  "insuranceProvider",
  "insuranceNumber",
  "privacyConsent",
  "serviceConsent",
  "medicalConsent",
  "img",
  "colorCode",
  "createdAt",
  "updatedAt",
]);

export default PatientScalarFieldEnumSchema;
