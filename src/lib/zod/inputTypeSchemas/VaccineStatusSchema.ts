import { z } from "zod";

export const VaccineStatusSchema = z.enum(["DUE", "GIVEN", "OVERDUE", "EXPIRED", "CATCH_UP"]);

export type VaccineStatusType = `${z.infer<typeof VaccineStatusSchema>}`;

export default VaccineStatusSchema;
