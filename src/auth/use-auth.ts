// src/lib/auth/use-auth.ts
import { useCallback, useEffect, useState } from "react";

import { getSession, type Session } from ".";

export interface AuthUser {
  id: string;
  createdAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  updatedAt: Date;
  banExpires?: Date | null;
  banned?: boolean | null;
  banReason?: string | null;
  firstName?: string | null;
  image?: string | null;
  lastName?: string | null;
  role?: string | null;
}

/**
 * Normalize raw user data from the session.
 */
function normalizeUser(user: unknown): AuthUser {
  const u = user as Partial<AuthUser> & {
    id: string;
    createdAt: Date;
    email: string;
    name: string;
    updatedAt: Date;
  };

  return {
    id: u.id,
    banExpires: u.banExpires ?? null,
    banned: u.banned ?? null,
    banReason: u.banReason ?? null,
    createdAt: new Date(u.createdAt),
    email: u.email,
    emailVerified: u.emailVerified ?? false,
    firstName: u.firstName ?? null,
    image: u.image ?? null,
    lastName: u.lastName ?? null,
    name: u.name,
    role: u.role ?? null,
    updatedAt: new Date(u.updatedAt),
  };
}

/**
 * Custom hook to manage and expose user session state.
 */
export function useAuth() {
  const [status, setStatus] = useState<"authenticated" | "loading" | "unauthenticated">("loading");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const fetchSession = useCallback(async () => {
    try {
      const session: Session | null = await getSession();
      if (session?.user) {
        setUser(normalizeUser(session.user));
        setStatus("authenticated");
        setError(null);
      } else {
        setUser(null);
        setStatus("unauthenticated");
        setError(null);
      }
    } catch (err) {
      console.error("Failed to retrieve session:", err);
      setUser(null);
      setStatus("unauthenticated");
      setError(err instanceof Error ? err : new Error("Unknown error during authentication."));
    }
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  return { error, status, user };
}

/**
 * Hook to expose simplified auth data for UI components.
 */
export function useUser() {
  const { error, status, user } = useAuth();

  return {
    error,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    user,
  };
}
