// Define a type for the string representation of roles.
// This ensures that only valid role strings are used.
// In src/types/globals.ts
export type UserRoles = "admin" | "doctor" | "patient";
declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      // The role in the JWT token is a string
      role?: UserRoles;
    };
  }
}

declare global {
  interface Window {
    cookieStore?: {
      // Make it optional as not all browsers support it
      set: (options: CookieStoreSetOptions) => Promise<void>;
      get: (name: string) => Promise<CookieStoreGetResult | null>;
      // Add other methods if you use them, like delete, getAll, etc.
    };
  }

  interface CookieStoreSetOptions {
    name: string;
    value: string;
    expires?: number | Date;
    maxAge?: number;
    domain?: string;
    path?: string;
    sameSite?: "strict" | "lax" | "none";
  }

  interface CookieStoreGetResult {
    name: string;
    value: string;
    domain: string;
    path: string;
    expires: number | null;
    secure: boolean;
    sameSite: "strict" | "lax" | "none";
  }
}
