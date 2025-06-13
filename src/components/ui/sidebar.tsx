"use client";

import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 1 week in seconds
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

// --- New Helper Functions for Cookie Operations ---

/**
 * Reads the sidebar state from the cookie.
 * Prioritizes Cookie Store API, falls back to document.cookie.
 * @returns {Promise<boolean | null>} A promise that resolves to true/false for open/closed, or null if not found.
 */
async function getSidebarCookieState(): Promise<boolean | null> {
  if (typeof window === "undefined") {
    return null; // Not in a client-side environment
  }

  if ("cookieStore" in window && window.cookieStore) {
    // Added check for window.cookieStore being truthy
    try {
      const cookie = await window.cookieStore.get(SIDEBAR_COOKIE_NAME);
      return cookie ? cookie.value === "true" : null;
    } catch (error) {
      console.error("Error reading sidebar cookie with Cookie Store API:", error);
      // Fallback to document.cookie if Cookie Store API fails
    }
  }

  // Fallback for document.cookie if Cookie Store API is not supported or failed
  const name = `${SIDEBAR_COOKIE_NAME}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1);
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length) === "true";
    }
  }
  return null; // Cookie not found
}

/**
 * Writes the sidebar state to the cookie.
 * Prioritizes Cookie Store API, falls back to document.cookie.
 * @param {boolean} openState - The boolean state to save (true for open, false for closed).
 * @returns {Promise<void>} A promise that resolves when the cookie is set.
 */
async function setSidebarCookieState(openState: boolean): Promise<void> {
  if (typeof window === "undefined") {
    return; // Not in a client-side environment
  }

  if ("cookieStore" in window && window.cookieStore) {
    try {
      await window.cookieStore.set({
        name: SIDEBAR_COOKIE_NAME,
        value: String(openState),
        maxAge: SIDEBAR_COOKIE_MAX_AGE,
        path: "/",
      });
      return; // Successfully set with Cookie Store API, so we're done.
    } catch (error) {
      console.error("Error setting sidebar cookie with Cookie Store API:", error);
      // If cookieStore fails, we'll proceed to the document.cookie fallback.
    }
  }

  // Fallback for document.cookie if Cookie Store API is not supported or failed.
  // biome-ignore lint/suspicious/noDocumentCookie: This is a necessary fallback for older browsers that do not support the Cookie Store API.
  document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
}
// --- End Helper Functions ---

type SidebarContextProps = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  onOpenChange?: (open: boolean) => void;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextProps | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}

function _SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);

  const [internalOpenState, setInternalOpenState] = React.useState(defaultOpen);

  const open = openProp !== undefined ? openProp : internalOpenState;

  const setOpen = React.useCallback(
    async (value: boolean | ((value: boolean) => boolean)) => {
      const newOpenState = typeof value === "function" ? value(open) : value;

      if (setOpenProp) {
        setOpenProp(newOpenState);
      } else {
        setInternalOpenState(newOpenState);
      }

      await setSidebarCookieState(newOpenState); // Use the new helper function
    },
    [open, setOpenProp]
  );

  // Read cookie on mount to initialize the sidebar state
  React.useEffect(() => {
    const initializeSidebarState = async () => {
      const cookieState = await getSidebarCookieState(); // Use the new helper function
      if (cookieState !== null) {
        if (openProp === undefined) {
          setInternalOpenState(cookieState);
        }
        if (setOpenProp) {
          setOpenProp(cookieState);
        }
      }
    };

    initializeSidebarState();
  }, [openProp, setOpenProp]);

  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((prevOpen) => !prevOpen) : setOpen((prevOpen) => !prevOpen);
  }, [isMobile, setOpen]); // Added setOpenMobile to dependencies

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  const state = open ? "expanded" : "collapsed";

  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, toggleSidebar] // Added setOpenMobile to dependencies
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          data-slot="sidebar-wrapper"
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH,
              "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
              ...style,
            } as React.CSSProperties
          }
          className={cn(
            "group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-sidebar",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
}

// ... (The Sidebar component below remains unchanged as it uses the context)
function _Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  side?: "left" | "right";
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
}) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

  if (collapsible === "none") {
    return (
      <div
        data-slot="sidebar"
        className={cn(
          "flex h-full w-[var(--sidebar-width)] flex-col bg-sidebar text-sidebar-foreground",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          data-sidebar="sidebar"
          data-slot="sidebar"
          data-mobile="true"
          className="w-[var(--sidebar-width)] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
            } as React.CSSProperties
          }
          side={side}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </SheetHeader>
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      className="group peer hidden text-sidebar-foreground md:block"
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
      data-slot="sidebar"
    >
      {/* This is what handles the sidebar gap on desktop */}
      <div
        data-slot="sidebar-gap"
        className={cn(
          "relative w-[var(--sidebar-width)] bg-transparent transition-[width] duration-200 ease-linear",
          "group-data-[collapsible=offcanvas]:w-0",
          "group-data-[side=right]:rotate-180",
          variant === "floating" || variant === "inset"
            ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+var(--spacing-4))]"
            : "group-data-[collapsible=icon]:w-[var(--sidebar-width-icon)]"
        )}
      />
      <div
        data-slot="sidebar-container"
        className={cn(
          "fixed inset-y-0 z-10 hidden h-svh w-[var(--sidebar-width)] transition-[left,right,width] duration-200 ease-linear md:flex",
          side === "left"
            ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
            : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
          // Adjust the padding for floating and inset variants.
          variant === "floating" || variant === "inset"
            ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+var(--spacing-4)+2px)]"
            : "group-data-[collapsible=icon]:w-[var(--sidebar-width-icon)] group-data-[side=left]:border-r group-data-[side=right]:border-l",
          className
        )}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
          className="flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow-sm"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
