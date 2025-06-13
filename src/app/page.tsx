// src/app/page.tsx
// REMOVE: import { motion } from 'framer-motion';
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { getSession } from "@/auth";
// Import your new wrapper components
import { MotionDiv, MotionSpan } from "@/components/motionDiv"; // Adjust path if needed
import { Button } from "@/components/ui/button";
import { HydrateClient } from "@/trpc/server";
import { getUserRole } from "@/utils/roles";

export default async function Home() {
  const session = await getSession();
  const userId = session?.user.id;
  const role = userId ? await getUserRole() : null;

  if (userId && role) {
    redirect(`/${role.toLowerCase()}`);
  }

  return (
    <HydrateClient>
      <div className="flex h-screen flex-col items-center justify-between px-6 py-10 text-center">
        {/* Use MotionDiv instead of motion.div */}
        <MotionDiv
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-1 flex-col items-center justify-center px-4 md:px-8"
        >
          <h1 className="font-extrabold text-4xl leading-tight md:text-5xl lg:text-6xl">
            Welcome to
            {/* Use MotionSpan instead of motion.span */}
            <MotionSpan
              className="mt-3 block text-5xl text-blue-700 md:text-6xl lg:text-7xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.4, type: "spring" }}
            >
              Smart Clinic HMS
            </MotionSpan>
          </h1>

          <p className="mt-4 max-w-2xl text-gray-600 text-lg md:text-xl">
            Your trusted partner in pediatric and lactation care.
          </p>

          <p className="mt-4 max-w-2xl text-base text-gray-500">
            Manage patient records, appointments, and more. Streamline your pediatric clinic with
            ease and care-centered efficiency.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {userId ? (
              <Link href={`/${role}`}>
                <Button size="lg">View Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/sign-up" className="w-full sm:w-auto">
                  <Button className="w-full bg-blue-600 font-semibold text-lg text-white hover:bg-blue-700 sm:w-auto">
                    New Patient? Register Here!
                  </Button>
                </Link>

                <Suspense
                  fallback={
                    <div className="h-12 w-full animate-pulse rounded-md bg-gray-200 sm:w-auto" />
                  }
                >
                  <Link href="/login">
                    <Button variant="outline" className="text-base hover:text-blue-600">
                      Login to Account
                    </Button>
                  </Link>
                </Suspense>
              </>
            )}
          </div>
        </MotionDiv>{" "}
        {/* End of MotionDiv */}
        <footer className="mt-12 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Smart Clinic HMS. All rights reserved.
        </footer>
      </div>
    </HydrateClient>
  );
}
