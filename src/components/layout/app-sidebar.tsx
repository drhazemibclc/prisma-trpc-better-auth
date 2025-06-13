"use client";

import {
  Activity,
  Baby,
  BarChart3,
  Calendar,
  CreditCard,
  FileText,
  Home,
  MessageSquare,
  Settings,
  Shield,
  UserCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useRole } from "@/auth/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

// Navigation items for different roles
const navigationItems = {
  admin: [
    {
      icon: Home,
      title: "Dashboard",
      url: "/admin",
    },
    {
      icon: Users,
      title: "Patients",
      url: "/admin/patients",
    },
    {
      icon: UserCheck,
      title: "Staff",
      url: "/admin/staff",
    },
    {
      icon: Calendar,
      title: "Appointments",
      url: "/admin/appointments",
    },
    {
      icon: CreditCard,
      title: "Payments",
      url: "/admin/payments",
    },
    {
      icon: BarChart3,
      title: "Reports",
      url: "/admin/reports",
    },
    {
      icon: Settings,
      title: "Settings",
      url: "/admin/settings",
    },
  ],
  doctor: [
    {
      icon: Home,
      title: "Dashboard",
      url: "/doctor",
    },
    {
      icon: Users,
      title: "Patients",
      url: "/doctor/patients",
    },
    {
      icon: Calendar,
      title: "Appointments",
      url: "/doctor/appointments",
    },
    {
      icon: FileText,
      title: "Medical Records",
      url: "/doctor/records",
    },
    {
      icon: Activity,
      title: "Growth Tracking",
      url: "/doctor/growth",
    },
    {
      icon: Shield,
      title: "Immunizations",
      url: "/doctor/immunizations",
    },
    {
      icon: MessageSquare,
      title: "Messages",
      url: "/doctor/messages",
    },
  ],
  nurse: [
    {
      icon: Home,
      title: "Dashboard",
      url: "/nurse",
    },
    {
      icon: Users,
      title: "Patients",
      url: "/nurse/patients",
    },
    {
      icon: Calendar,
      title: "Appointments",
      url: "/nurse/appointments",
    },
    {
      icon: Activity,
      title: "Vital Signs",
      url: "/nurse/vitals",
    },
    {
      icon: Shield,
      title: "Immunizations",
      url: "/nurse/immunizations",
    },
    {
      icon: MessageSquare,
      title: "Messages",
      url: "/nurse/messages",
    },
  ],
  patient: [
    {
      icon: Home,
      title: "Dashboard",
      url: "/patient",
    },
    {
      icon: Calendar,
      title: "Appointments",
      url: "/patient/appointments",
    },
    {
      icon: FileText,
      title: "Medical Records",
      url: "/patient/records",
    },
    {
      icon: BarChart3,
      title: "Growth Charts",
      url: "/patient/growth",
    },
    {
      icon: Shield,
      title: "Immunizations",
      url: "/patient/immunizations",
    },
    {
      icon: MessageSquare,
      title: "Messages",
      url: "/patient/messages",
    },
  ],
};

export function AppSidebar() {
  const pathname = usePathname();
  const role = useRole();

  const items = navigationItems[role as keyof typeof navigationItems] || navigationItems.patient;

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Baby className="h-4 w-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Kinda HMS</span>
            <span className="truncate text-muted-foreground text-xs">Pediatric Clinic</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage alt="User" src="/placeholder.svg?height=32&width=32" />
                    <AvatarFallback className="rounded-lg">JD</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Dr. Jane Doe</span>
                    <span className="truncate text-muted-foreground text-xs capitalize">
                      {role}
                    </span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                align="end"
                side="bottom"
                sideOffset={4}
              >
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Support
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
