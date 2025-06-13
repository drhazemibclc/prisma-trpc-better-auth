"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar"; // Assuming this is your shadcn-ui calendar
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Re-import the AppointmentCalendar you provided, as AppointmentScheduler will use it
import { AppointmentCalendar } from "./appointment-calendar";

export function AppointmentScheduler() {
  const [isNewAppointmentDialogOpen, setIsNewAppointmentDialogOpen] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [appointmentDate, setAppointmentDate] = useState<Date | undefined>(new Date());
  const [appointmentTime, setAppointmentTime] = useState("");
  const [appointmentType, setAppointmentType] = useState("");
  const [notes, setNotes] = useState("");

  const noteId = useId();
  const doctors = [
    { id: "1", name: "Dr. Sarah Wilson" },
    { id: "2", name: "Dr. Michael Chen" },
    { id: "3", name: "Dr. Emily Rodriguez" },
  ];

  const appointmentTypes = [
    "Regular Checkup",
    "Vaccination",
    "Follow-up",
    "Consultation",
    "Growth Assessment",
  ];

  const handleScheduleAppointment = () => {
    // In a real application, you'd send this data to a backend API
    const newAppointment = {
      patientName,
      doctorName: doctors.find((doc) => doc.id === selectedDoctor)?.name || "",
      date: appointmentDate?.toISOString().split("T")[0], // YYYY-MM-DD
      time: appointmentTime,
      type: appointmentType,
      notes,
      // You'd generate a real ID and status (e.g., 'pending') on the server
      id: String(Math.floor(Math.random() * 100000)),
      status: "scheduled",
    };
    console.log("Scheduling new appointment:", newAppointment);
    // You might want to refresh the calendar data or add this to mock data here
    // For now, just close the dialog and reset form
    setIsNewAppointmentDialogOpen(false);
    setPatientName("");
    setSelectedDoctor("");
    setAppointmentDate(new Date());
    setAppointmentTime("");
    setAppointmentType("");
    setNotes("");
    // Optionally, show a success toast/notification
  };

  // Generate time slots (e.g., every 30 minutes from 9 AM to 5 PM)
  const generateTimeSlots = () => {
    const slots = [];
    for (let h = 9; h <= 17; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hour = String(h).padStart(2, "0");
        const minute = String(m).padStart(2, "0");
        slots.push(`${hour}:${minute}`);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();
  const patientId = useId();
  return (
    <div className="space-y-6">
      {/* Appointment Calendar Section */}
      <AppointmentCalendar />

      {/* New Appointment Button & Dialog */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Schedule New Appointment</CardTitle>
            <CardDescription>Quickly add a new appointment to your schedule.</CardDescription>
          </div>
          <Dialog open={isNewAppointmentDialogOpen} onOpenChange={setIsNewAppointmentDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
              <DialogHeader>
                <DialogTitle>Book New Appointment</DialogTitle>
                <DialogDescription>
                  Fill in the details to schedule a new patient appointment.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="patientName" className="text-right">
                    Patient Name
                  </Label>
                  <Input
                    id={patientId}
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="col-span-3"
                    placeholder="e.g., John Doe"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="doctor" className="text-right">
                    Doctor
                  </Label>
                  <Select onValueChange={setSelectedDoctor} value={selectedDoctor}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          {doctor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="appointmentDate" className="text-right">
                    Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={`col-span-3 w-full justify-start text-left font-normal ${
                          !appointmentDate && "text-muted-foreground"
                        }`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {appointmentDate ? (
                          format(appointmentDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={appointmentDate}
                        onSelect={setAppointmentDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="appointmentTime" className="text-right">
                    Time
                  </Label>
                  <Select onValueChange={setAppointmentTime} value={appointmentTime}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="appointmentType" className="text-right">
                    Type
                  </Label>
                  <Select onValueChange={setAppointmentType} value={appointmentType}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select appointment type" />
                    </SelectTrigger>
                    <SelectContent>
                      {appointmentTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="notes" className="pt-2 text-right">
                    Notes
                  </Label>
                  <Textarea
                    id={noteId}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="col-span-3"
                    placeholder="Any specific notes for this appointment?"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleScheduleAppointment}>Schedule Appointment</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
      </Card>
    </div>
  );
}
