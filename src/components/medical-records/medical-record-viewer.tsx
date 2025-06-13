"use client";

import { Activity, Calendar, Download, Eye, FileText, Pill, TestTube } from "lucide-react";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MedicalRecord {
  id: string;
  chiefComplaint: string;
  date: string;
  diagnosis: string[];
  doctor: {
    name: string;
    specialty: string;
    avatar?: string;
  };
  labTests: Array<{
    normalRange: string;
    result: string;
    status: "abnormal" | "normal" | "pending";
    test: string;
  }>;
  notes: string;
  prescriptions: Array<{
    dosage: string;
    duration: string;
    frequency: string;
    medication: string;
  }>;
  type: string;
  vitals: {
    bloodPressure: string;
    heartRate: number;
    height: number;
    temperature: number;
    weight: number;
  };
  followUp?: string;
}

const mockRecord: MedicalRecord = {
  id: "MR-2024-001",
  chiefComplaint: "Routine wellness visit and growth assessment",
  date: "2024-01-08",
  diagnosis: ["Normal growth and development", "Up-to-date immunizations"],
  doctor: {
    avatar: "/placeholder.svg?height=40&width=40",
    name: "Dr. Sarah Johnson",
    specialty: "Pediatrician",
  },
  followUp: "Schedule next wellness visit in 6 months (July 2024)",
  labTests: [
    {
      normalRange: "Within normal limits",
      result: "Normal",
      status: "normal",
      test: "Complete Blood Count",
    },
    {
      normalRange: "11-15 mg/dL",
      result: "12.5 mg/dL",
      status: "normal",
      test: "Iron Level",
    },
  ],
  notes:
    "Patient is developing normally. Growth is tracking along the 75th percentile for both height and weight. No concerns noted. Continue current diet and activity level. Next routine visit in 6 months.",
  prescriptions: [
    {
      dosage: "1 tablet",
      duration: "Ongoing",
      frequency: "Once daily",
      medication: "Children's Multivitamin",
    },
  ],
  type: "Regular Checkup",
  vitals: {
    bloodPressure: "95/60",
    heartRate: 95,
    height: 95,
    temperature: 98.6,
    weight: 14.2,
  },
};

export function MedicalRecordViewer() {
  const [selectedRecord] = useState<MedicalRecord>(mockRecord);

  const _getLabTestStatusColor = (status: string) => {
    switch (status) {
      case "abnormal":
        return "bg-red-500";
      case "normal":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getLabTestStatusVariant = (status: string) => {
    switch (status) {
      case "abnormal":
        return "destructive";
      case "normal":
        return "secondary";
      case "pending":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">Medical Record</h1>
          <p className="text-muted-foreground">Record ID: {selectedRecord.id}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Record Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={selectedRecord.doctor.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {selectedRecord.doctor.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{selectedRecord.doctor.name}</CardTitle>
                <CardDescription>{selectedRecord.doctor.specialty}</CardDescription>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 text-muted-foreground text-sm">
                <Calendar className="h-4 w-4" />
                <span>{new Date(selectedRecord.date).toLocaleDateString()}</span>
              </div>
              <Badge variant="outline" className="mt-1">
                {selectedRecord.type}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="mb-2 font-medium text-muted-foreground text-sm">Chief Complaint</h4>
              <p className="text-sm">{selectedRecord.chiefComplaint}</p>
            </div>
            <Separator />
            <div>
              <h4 className="mb-2 font-medium text-muted-foreground text-sm">Diagnosis</h4>
              <div className="flex flex-wrap gap-2">
                {selectedRecord.diagnosis.map((diagnosis, index) => (
                  <Badge key={index} variant="secondary">
                    {diagnosis}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Information */}
      <Tabs className="space-y-4" defaultValue="vitals">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          <TabsTrigger value="lab-tests">Lab Tests</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent className="space-y-4" value="vitals">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Vital Signs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <p className="font-medium text-muted-foreground text-sm">Temperature</p>
                  <p className="font-bold text-2xl">{selectedRecord.vitals.temperature}°F</p>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-muted-foreground text-sm">Heart Rate</p>
                  <p className="font-bold text-2xl">{selectedRecord.vitals.heartRate} bpm</p>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-muted-foreground text-sm">Blood Pressure</p>
                  <p className="font-bold text-2xl">{selectedRecord.vitals.bloodPressure} mmHg</p>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-muted-foreground text-sm">Weight</p>
                  <p className="font-bold text-2xl">{selectedRecord.vitals.weight} kg</p>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-muted-foreground text-sm">Height</p>
                  <p className="font-bold text-2xl">{selectedRecord.vitals.height} cm</p>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-muted-foreground text-sm">BMI</p>
                  <p className="font-bold text-2xl">
                    {(
                      selectedRecord.vitals.weight /
                      (selectedRecord.vitals.height / 100) ** 2
                    ).toFixed(1)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent className="space-y-4" value="prescriptions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5" />
                Prescriptions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedRecord.prescriptions.map((prescription, index) => (
                  <div key={index} className="space-y-2 rounded-lg border p-4">
                    <h4 className="font-medium">{prescription.medication}</h4>
                    <div className="grid gap-2 text-muted-foreground text-sm md:grid-cols-3">
                      <div>
                        <span className="font-medium">Dosage:</span> {prescription.dosage}
                      </div>
                      <div>
                        <span className="font-medium">Frequency:</span> {prescription.frequency}
                      </div>
                      <div>
                        <span className="font-medium">Duration:</span> {prescription.duration}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent className="space-y-4" value="lab-tests">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                Laboratory Tests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedRecord.labTests.map((test, index) => (
                  <div key={index} className="space-y-2 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{test.test}</h4>
                      <Badge variant={getLabTestStatusVariant(test.status)}>{test.status}</Badge>
                    </div>
                    <div className="grid gap-2 text-sm md:grid-cols-2">
                      <div>
                        <span className="font-medium text-muted-foreground">Result:</span>{" "}
                        {test.result}
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Normal Range:</span>{" "}
                        {test.normalRange}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent className="space-y-4" value="notes">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Clinical Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="mb-2 font-medium text-muted-foreground text-sm">Provider Notes</h4>
                <p className="text-sm leading-relaxed">{selectedRecord.notes}</p>
              </div>
              {selectedRecord.followUp && (
                <>
                  <Separator />
                  <div>
                    <h4 className="mb-2 font-medium text-muted-foreground text-sm">
                      Follow-up Instructions
                    </h4>
                    <p className="text-sm leading-relaxed">{selectedRecord.followUp}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
