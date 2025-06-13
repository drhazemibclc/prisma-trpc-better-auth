import { toNextJsHandler } from "better-auth/next-js";

import { handler } from "@/auth";

export const { GET, POST } = toNextJsHandler(handler);
