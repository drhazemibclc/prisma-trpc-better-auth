import { z } from "zod";

export const AuditLogScalarFieldEnumSchema = z.enum([
  "id",
  "userId",
  "recordId",
  "action",
  "details",
  "modelName",
  "createdAt",
  "updatedAt",
]);

export default AuditLogScalarFieldEnumSchema;
