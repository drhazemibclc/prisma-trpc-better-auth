import { z } from "zod";

export const MilestoneCategorySchema = z.enum([
  "GROSS_MOTOR",
  "FINE_MOTOR",
  "LANGUAGE",
  "SOCIAL_EMOTIONAL",
  "COGNITIVE",
]);

export type MilestoneCategoryType = `${z.infer<typeof MilestoneCategorySchema>}`;

export default MilestoneCategorySchema;
