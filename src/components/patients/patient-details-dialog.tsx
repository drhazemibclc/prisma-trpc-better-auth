// src/components/patients/patient-details-dialog.tsx
"use client";

import type { Patient } from "@prisma/client";
import { format } from "date-fns";
import { AlertTriangle, Calendar, FileText, Mail, Phone } from "lucide-react";
import type * as React from "react"; // Ensure React is imported

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PatientDetailsDialogProps {
  open: boolean;
  patient: Patient;
  onOpenChange: (open: boolean) => void;
}

// --- Extracted Sub-Components to reduce complexity of main Dialog ---

interface PatientOverviewTabProps {
  patient: Patient;
}

const PatientOverviewTab: React.FC<PatientOverviewTabProps> = ({ patient }) => (
  <div className="grid gap-4 md:grid-cols-2">
    {/* Guardian Information */}
    <Card>
      <CardHeader>
        <CardTitle>Guardian Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <p className="font-medium">{patient.relation || "N/A"}</p>
          <p className="text-muted-foreground text-sm">Primary Guardian</p>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <Phone className="h-4 w-4" />
          <span>{patient.phone || "N/A"}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <Mail className="h-4 w-4" />
          <span>{patient.email || "N/A"}</span>
        </div>
      </CardContent>
    </Card>

    {/* Medical Conditions */}
    <Card>
      <CardHeader>
        <CardTitle>Current Conditions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {patient.medicalConditions ? (
            patient.medicalConditions.split(",").map((condition: string, index: number) => (
              <Badge key={index} variant="outline">
                {condition.trim()}
              </Badge>
            ))
          ) : (
            <p className="text-muted-foreground text-sm">No known medical conditions</p>
          )}
        </div>
      </CardContent>
    </Card>

    {/* Allergies */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          <span>Allergies</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {patient.allergies ? (
          <p className="text-muted-foreground text-sm">{patient.allergies}</p>
        ) : (
          <p className="text-muted-foreground text-sm">No known allergies</p>
        )}
      </CardContent>
    </Card>

    {/* Emergency Contact */}
    <Card>
      <CardHeader>
        <CardTitle>Emergency Contact</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <p className="font-medium">{patient.emergencyContactName || "N/A"}</p>
          <p className="text-muted-foreground text-sm">Emergency Contact</p>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <Phone className="h-4 w-4" />
          <span>{patient.emergencyContactNumber || "N/A"}</span>
        </div>
      </CardContent>
    </Card>
  </div>
);

// Mock data for appointments - ideally, this would come from `patient` prop or a fetch
const mockRecentAppointments = [
  {
    date: "2024-01-08",
    doctor: "Dr. Sarah Johnson",
    notes: "Patient is healthy, growth on track",
    type: "Regular Checkup",
  },
  {
    date: "2023-12-15",
    doctor: "Dr. Michael Chen",
    notes: "MMR vaccine administered, no adverse reactions",
    type: "Vaccination",
  },
];

const PatientAppointmentsTab: React.FC = () => (
  <div className="space-y-4">
    {mockRecentAppointments.map((appointment, index) => (
      <Card key={index}>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{appointment.type}</Badge>
                <span className="text-muted-foreground text-sm">{appointment.date}</span>
              </div>
              <p className="font-medium">{appointment.doctor}</p>
              <p className="text-muted-foreground text-sm">{appointment.notes}</p>
            </div>
            <Button size="sm" variant="ghost">
              <FileText className="mr-2 h-4 w-4" />
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

// Mock data for vital signs
const mockVitalSigns = [
  { label: "Height", percentile: "75th", value: "95 cm" },
  { label: "Weight", percentile: "70th", value: "14.2 kg" },
  { label: "BMI", status: "Normal", value: "15.7" },
  { label: "Blood Pressure", status: "Normal", value: "95/60 mmHg" },
];

const PatientVitalsTab: React.FC = () => (
  <div className="grid gap-4 md:grid-cols-2">
    {mockVitalSigns.map((vital, index) => (
      <Card key={index}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{vital.label}</p>
              <p className="font-bold text-2xl">{vital.value}</p>
            </div>
            <div className="text-right">
              <Badge variant="outline">{vital.percentile || vital.status}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

const PatientImmunizationsTab: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>Vaccination History</CardTitle>
      <CardDescription>Track immunization progress and schedule</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="py-8 text-center text-muted-foreground">
        Immunization records will be displayed here
      </p>
    </CardContent>
  </Card>
);

const PatientNotesTab: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>Clinical Notes</CardTitle>
      <CardDescription>Doctor's notes and observations</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="py-8 text-center text-muted-foreground">
        Clinical notes will be displayed here
      </p>
    </CardContent>
  </Card>
);

// --- Main PatientDetailsDialog Component ---

export function PatientDetailsDialog({ open, patient, onOpenChange }: PatientDetailsDialogProps) {
  if (!patient) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Patient Details</DialogTitle>
          <DialogDescription>
            Complete medical information and history for {patient.firstName} {patient.lastName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Patient Header */}
          <div className="flex items-start space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={patient.img || "/placeholder.svg"} />
              <AvatarFallback className="text-lg">
                {(patient.firstName?.[0] || "") + (patient.lastName?.[0] || "")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="mb-2 flex items-center space-x-2">
                <h2 className="font-bold text-2xl">
                  {patient.firstName} {patient.lastName}
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-4 text-muted-foreground text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Age:{" "}
                    {patient.dateOfBirth
                      ? new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()
                      : "N/A"}{" "}
                    years (
                    {patient.dateOfBirth ? format(new Date(patient.dateOfBirth), "PPP") : "N/A"})
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>Gender: {patient.gender}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>{patient.phone || "N/A"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>{patient.email || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs className="space-y-4" defaultValue="overview">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
              <TabsTrigger value="immunizations">Immunizations</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            <TabsContent className="space-y-4" value="overview">
              <PatientOverviewTab patient={patient} />
            </TabsContent>

            <TabsContent className="space-y-4" value="appointments">
              <PatientAppointmentsTab />
            </TabsContent>

            <TabsContent className="space-y-4" value="vitals">
              <PatientVitalsTab />
            </TabsContent>

            <TabsContent className="space-y-4" value="immunizations">
              <PatientImmunizationsTab />
            </TabsContent>

            <TabsContent className="space-y-4" value="notes">
              <PatientNotesTab />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
