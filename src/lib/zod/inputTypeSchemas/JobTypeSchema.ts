import { z } from "zod";

export const JobTypeSchema = z.enum(["FULL", "PART"]);

export type JobTypeType = `${z.infer<typeof JobTypeSchema>}`;

export default JobTypeSchema;
