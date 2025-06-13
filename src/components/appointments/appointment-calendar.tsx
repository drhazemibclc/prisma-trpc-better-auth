"use client";

import { Calendar, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Appointment {
  id: string;
  doctorName: string;
  patientName: string;
  status: "cancelled" | "completed" | "pending" | "scheduled";
  time: string;
  type: string;
  avatar?: string;
}

const mockAppointments: Record<string, Appointment[]> = {
  "2024-01-15": [
    {
      id: "1",
      doctorName: "Dr. Sarah Wilson",
      patientName: "Emma Johnson",
      status: "scheduled",
      time: "09:00",
      type: "Regular Checkup",
    },
    {
      id: "2",
      doctorName: "Dr. Michael Chen",
      patientName: "Liam Smith",
      status: "scheduled",
      time: "10:30",
      type: "Vaccination",
    },
    {
      id: "3",
      doctorName: "Dr. Sarah Wilson",
      patientName: "Olivia Brown",
      status: "completed",
      time: "14:00",
      type: "Follow-up",
    },
  ],
  "2024-01-16": [
    {
      id: "4",
      doctorName: "Dr. Emily Rodriguez",
      patientName: "Noah Davis",
      status: "scheduled",
      time: "11:00",
      type: "Consultation",
    },
  ],
};

export function AppointmentCalendar() {
  const [selectedDate, setSelectedDate] = useState("2024-01-15");
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 0)); // January 2024

  const appointments = mockAppointments[selectedDate] || [];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const formatDate = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  const hasAppointments = (day: number) => {
    const dateStr = formatDate(day);
    return mockAppointments[dateStr] && mockAppointments[dateStr].length > 0;
  };

  const _getStatusColor = (status: string) => {
    switch (status) {
      case "cancelled":
        return "bg-red-500";
      case "completed":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "scheduled":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "cancelled":
        return "destructive";
      case "completed":
        return "secondary";
      case "pending":
        return "outline";
      case "scheduled":
        return "default";
      default:
        return "outline";
    }
  };

  const navigateMonth = (direction: "next" | "prev") => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      if (direction === "prev") {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Calendar */}
      <Card className="md:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Appointment Calendar</CardTitle>
              <CardDescription>Schedule and manage appointments</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button size="icon" variant="outline" onClick={() => navigateMonth("prev")}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="min-w-[120px] text-center font-medium text-sm">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </div>
              <Button size="icon" variant="outline" onClick={() => navigateMonth("next")}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 grid grid-cols-7 gap-2">
            {dayNames.map((day) => (
              <div key={day} className="p-2 text-center font-medium text-muted-foreground text-sm">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {getDaysInMonth(currentMonth).map((day, index) => (
              <div key={index} className="aspect-square">
                {day && (
                  <Button
                    variant={selectedDate === formatDate(day) ? "default" : "ghost"}
                    className={`relative h-full w-full p-1 ${
                      hasAppointments(day) ? "ring-2 ring-primary ring-offset-2" : ""
                    }`}
                    onClick={() => setSelectedDate(formatDate(day))}
                  >
                    <span className="text-sm">{day}</span>
                    {hasAppointments(day) && (
                      <div className="-translate-x-1/2 absolute bottom-1 left-1/2 h-1 w-1 transform rounded-full bg-primary" />
                    )}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Appointments for Selected Date */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {new Date(selectedDate).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              weekday: "long",
            })}
          </CardTitle>
          <CardDescription>
            {appointments.length} appointment
            {appointments.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {appointments.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <Calendar className="mx-auto mb-4 h-12 w-12 opacity-50" />
              <p>No appointments scheduled</p>
            </div>
          ) : (
            appointments.map((appointment) => (
              <div key={appointment.id} className="space-y-3 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={appointment.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {appointment.patientName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{appointment.patientName}</p>
                      <p className="text-muted-foreground text-xs">{appointment.doctorName}</p>
                    </div>
                  </div>
                  <Badge variant={getStatusVariant(appointment.status)}>{appointment.status}</Badge>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{appointment.time}</span>
                  </div>
                  <span className="text-muted-foreground">{appointment.type}</span>
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    View Details
                  </Button>
                  {appointment.status === "scheduled" && (
                    <Button size="sm" variant="outline">
                      Reschedule
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}

          <Button className="w-full">
            <Calendar className="mr-2 h-4 w-4" />
            Book New Appointment
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
