import { z } from "zod";

export const DoctorScalarFieldEnumSchema = z.enum([
  "id",
  "email",
  "name",
  "specialization",
  "licenseNumber",
  "phone",
  "address",
  "department",
  "img",
  "colorCode",
  "availabilityStatus",
  "jobType",
  "createdAt",
  "updatedAt",
]);

export default DoctorScalarFieldEnumSchema;
