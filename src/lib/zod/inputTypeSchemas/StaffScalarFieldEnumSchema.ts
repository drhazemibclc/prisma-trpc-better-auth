import { z } from "zod";

export const StaffScalarFieldEnumSchema = z.enum([
  "id",
  "email",
  "name",
  "phone",
  "address",
  "department",
  "img",
  "licenseNumber",
  "colorCode",
  "role",
  "status",
  "createdAt",
  "updatedAt",
]);

export default StaffScalarFieldEnumSchema;
