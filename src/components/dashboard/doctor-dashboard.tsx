"use client";

import { Activity, Calendar, FileText, Filter, Plus, Search, Users } from "lucide-react";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { AppointmentScheduler } from "../appointments/appointment-scheduler";
import { AddPatientDialog } from "../patients/add-patient-dialog";
import { PatientList } from "../patients/patient-list";
import { RecentActivities } from "./recent-activities";
import { StatsCard } from "./stats-card";

export function DoctorDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddPatient, setShowAddPatient] = useState(false);

  const todayAppointments = [
    {
      id: 1,
      age: "5 years",
      avatar: "/placeholder.svg?height=40&width=40",
      patient: "Emma Johnson",
      status: "confirmed",
      time: "09:00 AM",
      type: "Regular Checkup",
    },
    {
      id: 2,
      age: "8 years",
      avatar: "/placeholder.svg?height=40&width=40",
      patient: "Michael Chen",
      status: "confirmed",
      time: "10:30 AM",
      type: "Follow-up",
    },
    {
      id: 3,
      age: "3 years",
      avatar: "/placeholder.svg?height=40&width=40",
      patient: "Sofia Rodriguez",
      status: "pending",
      time: "02:00 PM",
      type: "Vaccination",
    },
    {
      id: 4,
      age: "12 years",
      avatar: "/placeholder.svg?height=40&width=40",
      patient: "David Kim",
      status: "confirmed",
      time: "03:30 PM",
      type: "Growth Assessment",
    },
  ];

  const recentPatients = [
    {
      id: 1,
      age: "5 years",
      avatar: "/placeholder.svg?height=40&width=40",
      condition: "Healthy",
      lastVisit: "2024-01-08",
      name: "Emma Johnson",
      nextAppointment: "2024-01-15",
    },
    {
      id: 2,
      age: "8 years",
      avatar: "/placeholder.svg?height=40&width=40",
      condition: "Asthma monitoring",
      lastVisit: "2024-01-05",
      name: "Michael Chen",
      nextAppointment: "2024-01-12",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">Doctor Dashboard</h1>
          <p className="text-muted-foreground">Manage your pediatric patients and appointments</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule
          </Button>
          <Button onClick={() => setShowAddPatient(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Patient
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          value="247"
          description="Active patients"
          title="Total Patients"
          icon={Users}
          trend={{ isPositive: true, value: 12 }}
        />
        <StatsCard
          value="8"
          description="4 completed"
          title="Today's Appointments"
          icon={Calendar}
          trend={{ isPositive: true, value: 2 }}
        />
        <StatsCard
          value="15"
          description="Medical records"
          title="Pending Reviews"
          icon={FileText}
        />
        <StatsCard
          value="3"
          description="Require attention"
          title="Growth Alerts"
          icon={Activity}
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs className="space-y-4" defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="records">Medical Records</TabsTrigger>
        </TabsList>

        <TabsContent className="space-y-4" value="overview">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Today's Appointments */}
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Today's Appointments</CardTitle>
                <CardDescription>Your scheduled patients for today</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {todayAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center space-x-4 rounded-lg border p-4"
                  >
                    <Avatar>
                      <AvatarImage src={appointment.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {appointment.patient
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-sm">{appointment.patient}</p>
                        <Badge variant="outline">{appointment.age}</Badge>
                      </div>
                      <p className="text-muted-foreground text-sm">{appointment.type}</p>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={appointment.status === "confirmed" ? "default" : "secondary"}
                        >
                          {appointment.status}
                        </Badge>
                        <span className="text-muted-foreground text-sm">{appointment.time}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      View Patient
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <RecentActivities />
          </div>

          {/* Recent Patients */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Patients</CardTitle>
              <CardDescription>Patients you've seen recently</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="flex items-center space-x-4 rounded-lg border p-4"
                  >
                    <Avatar>
                      <AvatarImage src={patient.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {patient.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-sm">{patient.name}</p>
                        <Badge variant="outline">{patient.age}</Badge>
                      </div>
                      <p className="text-muted-foreground text-sm">{patient.condition}</p>
                      <div className="flex items-center space-x-4 text-muted-foreground text-xs">
                        <span>Last visit: {patient.lastVisit}</span>
                        <span>Next: {patient.nextAppointment}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <FileText className="mr-2 h-4 w-4" />
                      Records
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patients">
          <PatientList />
        </TabsContent>

        <TabsContent value="appointments">
          <AppointmentScheduler />
        </TabsContent>

        <TabsContent value="records">
          <Card>
            <CardHeader>
              <CardTitle>Medical Records</CardTitle>
              <CardDescription>Review and manage patient medical records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search medical records..."
                  />
                </div>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
              <p className="py-8 text-center text-muted-foreground">
                Medical records management interface will be displayed here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Patient Dialog */}
      <AddPatientDialog open={showAddPatient} onOpenChange={setShowAddPatient} />
    </div>
  );
}
