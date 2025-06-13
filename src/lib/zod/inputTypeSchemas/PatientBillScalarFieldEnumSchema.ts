import { z } from "zod";

export const PatientBillScalarFieldEnumSchema = z.enum([
  "id",
  "billId",
  "serviceId",
  "serviceDate",
  "quantity",
  "unitCost",
  "totalCost",
  "createdAt",
  "updatedAt",
]);

export default PatientBillScalarFieldEnumSchema;
