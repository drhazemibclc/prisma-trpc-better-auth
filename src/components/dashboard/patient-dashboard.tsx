"use client";

import { Activity, Calendar, Clock, FileText, Shield, TrendingUp } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import { StatsCard } from "./stats-card";

export function PatientDashboard() {
  const upcomingAppointments = [
    {
      id: 1,
      avatar: "/placeholder.svg?height=40&width=40",
      date: "2024-01-15",
      doctor: "Dr. Sarah Johnson",
      specialty: "Pediatrician",
      time: "10:00 AM",
      type: "Regular Checkup",
    },
    {
      id: 2,
      avatar: "/placeholder.svg?height=40&width=40",
      date: "2024-01-22",
      doctor: "Dr. Michael Chen",
      specialty: "Immunologist",
      time: "2:30 PM",
      type: "Vaccination",
    },
  ];

  const recentRecords = [
    {
      id: 1,
      date: "2024-01-08",
      doctor: "Dr. Sarah Johnson",
      summary: "Regular growth assessment - all normal",
      type: "Checkup",
    },
    {
      id: 2,
      date: "2024-12-15",
      doctor: "Dr. Michael Chen",
      summary: "MMR vaccine administered",
      type: "Vaccination",
    },
  ];

  const immunizationProgress = [
    { completed: true, dueDate: "Completed", name: "MMR" },
    { completed: true, dueDate: "Completed", name: "DTaP" },
    { completed: false, dueDate: "Due: Jan 30, 2024", name: "Polio" },
    { completed: false, dueDate: "Due: Feb 15, 2024", name: "Hepatitis B" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">Welcome back, Emma!</h1>
          <p className="text-muted-foreground">Here's what's happening with your health journey</p>
        </div>
        <Button>
          <Calendar className="mr-2 h-4 w-4" />
          Book Appointment
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          value="Jan 15"
          description="Dr. Sarah Johnson"
          title="Next Appointment"
          icon={Calendar}
        />
        <StatsCard
          value="75th"
          description="Height for age"
          title="Growth Percentile"
          icon={TrendingUp}
          trend={{ isPositive: true, value: 5 }}
        />
        <StatsCard value="8/10" description="Up to date" title="Immunizations" icon={Shield} />
        <StatsCard value="8 days" description="ago" title="Last Visit" icon={Clock} />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Upcoming Appointments */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Your scheduled visits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center space-x-4 rounded-lg border p-4"
              >
                <Avatar>
                  <AvatarImage src={appointment.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {appointment.doctor
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="font-medium text-sm leading-none">{appointment.doctor}</p>
                  <p className="text-muted-foreground text-sm">{appointment.specialty}</p>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{appointment.type}</Badge>
                    <span className="text-muted-foreground text-sm">
                      {appointment.date} at {appointment.time}
                    </span>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  View Details
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Immunization Status */}
        <Card>
          <CardHeader>
            <CardTitle>Immunization Status</CardTitle>
            <CardDescription>Track vaccination progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {immunizationProgress.map((vaccine, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{vaccine.name}</span>
                  {vaccine.completed ? (
                    <Badge variant="default" className="bg-green-500">
                      Complete
                    </Badge>
                  ) : (
                    <Badge variant="outline">Pending</Badge>
                  )}
                </div>
                <p className="text-muted-foreground text-xs">{vaccine.dueDate}</p>
                <Progress className="h-2" value={vaccine.completed ? 100 : 0} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Medical Records */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recent Medical Records</CardTitle>
            <CardDescription>Your latest health information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentRecords.map((record) => (
              <div key={record.id} className="flex items-center space-x-4 rounded-lg border p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center space-x-2">
                    <p className="font-medium text-sm">{record.type}</p>
                    <Badge variant="outline">{record.date}</Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">{record.doctor}</p>
                  <p className="text-sm">{record.summary}</p>
                </div>
                <Button size="sm" variant="ghost">
                  <FileText className="mr-2 h-4 w-4" />
                  View
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Growth Chart Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Growth Progress</CardTitle>
            <CardDescription>Height and weight tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Height</span>
                  <span className="font-medium text-sm">95 cm (75th percentile)</span>
                </div>
                <Progress className="h-2" value={75} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Weight</span>
                  <span className="font-medium text-sm">14.2 kg (70th percentile)</span>
                </div>
                <Progress className="h-2" value={70} />
              </div>
              <Button variant="outline" className="w-full">
                <Activity className="mr-2 h-4 w-4" />
                View Full Chart
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
