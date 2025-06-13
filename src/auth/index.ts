// src/lib/auth/index.ts

import { betterAuth as betterAuthClient } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin as adminPlugin, openAPI, organization } from "better-auth/plugins";
import { headers } from "next/headers";
import { cache } from "react";
import { z } from "zod";

import { env } from "@/env";
import { db } from "@/server/db";

import { accessControl, admin, doctor, nurse, patient } from "./permissions";

// Auth instance configuration
const _auth = betterAuthClient({
  baseURL: env.BETTER_AUTH_URL || "http://localhost:3000",
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    autoSignIn: false,
    enabled: true,
    requireEmailVerification: false,
  },

  plugins: [
    organization(),
    nextCookies(),
    openAPI(),
    adminPlugin({
      accessControl,
      adminRoles: ["admin", "doctor"],
      defaultRole: "patient",
      impersonationSessionDuration: 60 * 60 * 24 * 7,
      roles: { admin, doctor, nurse, patient },
    }),
  ],

  secret: env.BETTER_AUTH_SECRET,

  socialProviders: {
    google: {
      clientId: env.BETTER_AUTH_GOOGLE_ID,
      clientSecret: env.BETTER_AUTH_GOOGLE_SECRET,
    },
  },

  user: {
    additionalFields: {
      firstName: {
        required: false,
        type: "string",
      },
      lastName: {
        required: false,
        type: "string",
      },
      role: {
        input: false,
        required: false,
        type: "string",
        validator: {
          input: z.enum(["patient", "doctor", "admin", "nurse"]).default("patient"),
        },
      },
    },
    session: {
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60, // 5 minutes
      },
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24 * 7, // 7 days
    },
  },
});

// Export typesafe references
export const auth = _auth;
export const { handler } = _auth;

// Memoized session retrieval (used in layouts, middlewares, etc.)
export const getSession = cache(async () => {
  return await auth.api.getSession({
    headers: await headers(),
  });
});

export type Session = typeof auth.$Infer.Session;
export type User = Session["user"];
export type Role = User["role"];
