import { z } from "zod";

export const ServiceScalarFieldEnumSchema = z.enum([
  "id",
  "serviceName",
  "description",
  "price",
  "createdAt",
  "updatedAt",
]);

export default ServiceScalarFieldEnumSchema;
