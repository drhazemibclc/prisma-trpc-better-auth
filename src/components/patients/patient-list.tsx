"use client";

import { Gender, type Patient } from "@prisma/client"; // Import Patient type and Gender enum from Prisma
import { differenceInYears, format } from "date-fns"; // Import format and differenceInYears for date handling
import { Edit, Eye, Filter, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddPatientDialog } from "./add-patient-dialog";
import { EditPatientDialog } from "./edit-patient-dialog";
import { PatientDetailsDialog } from "./patient-details-dialog";

export function PatientList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [showEditPatient, setShowEditPatient] = useState(false);
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  // Corrected: Use Patient type from Prisma, can be null initially
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Helper function to calculate age from date of birth
  const calculateAge = (dob: Date): number => {
    return differenceInYears(new Date(), dob);
  };

  // Placeholder patient data - **IMPORTANT**: Align this with your actual Prisma Patient schema fields
  // Removed relation fields (e.g., growthRecords, immunizations) as they are not direct properties
  // of the base `Patient` type unless explicitly included in a Prisma query.
  const patients: Patient[] = [
    {
      id: "pat_001", // Using string IDs as is common with Prisma
      firstName: "Emma",
      lastName: "Johnson",
      dateOfBirth: new Date("2019-03-15"), // Use Date objects
      gender: Gender.GIRL, // Use Prisma Gender enum
      phone: "(555) 123-4567",
      email: "emma.johnson@email.com",
      nutritionalStatus: "Healthy",
      address: "123 Main St, Anytown, USA",
      emergencyContactName: "Sarah Johnson",
      emergencyContactNumber: "(555) 987-6543",
      relation: "Mother", // Corresponds to 'guardian' in old data
      bloodGroup: "O+",
      allergies: "None",
      medicalConditions: "Healthy", // Corresponds to 'conditions' in old data
      medicalHistory: "No significant medical history.",
      img: "/placeholder.svg", // Assuming this is where avatar URL goes
      colorCode: "#FF5733",
      role: null, // Placeholder if role is nullable
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "pat_002",
      firstName: "Michael",
      lastName: "Chen",
      dateOfBirth: new Date("2016-07-22"),
      gender: Gender.BOY, // Use Prisma Gender enum
      phone: "(555) 234-5678",
      email: "michael.chen@email.com",
      nutritionalStatus: "Normal",
      address: "456 Oak Ave, Cityville, USA",
      emergencyContactName: "Lisa Chen",
      emergencyContactNumber: "(555) 876-5432",
      relation: "Mother",
      bloodGroup: "A-",
      allergies: "Pollen",
      medicalConditions: "Asthma",
      medicalHistory: "Diagnosed with mild asthma at age 5.",
      img: "/placeholder.svg",
      colorCode: "#33FF57",
      role: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "pat_003",
      firstName: "Sofia",
      lastName: "Rodriguez",
      dateOfBirth: new Date("2021-11-08"),
      gender: Gender.GIRL,
      phone: "(555) 345-6789",
      email: "sofia.rodriguez@email.com",
      nutritionalStatus: "Healthy",
      address: "789 Pine Ln, Villagetown, USA",
      emergencyContactName: "Maria Rodriguez",
      emergencyContactNumber: "(555) 765-4321",
      relation: "Mother",
      bloodGroup: "B+",
      allergies: "N/A",
      medicalConditions: "None",
      medicalHistory: "No significant medical history.",
      img: "/placeholder.svg",
      colorCode: "#5733FF",
      role: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "pat_004",
      firstName: "David",
      lastName: "Kim",
      dateOfBirth: new Date("2012-04-30"),
      gender: Gender.BOY,
      phone: "(555) 456-7890",
      email: "david.kim@email.com",
      nutritionalStatus: "Underweight",
      address: "101 Maple Dr, Hamlet, USA",
      emergencyContactName: "Jennifer Kim",
      emergencyContactNumber: "(555) 654-3210",
      relation: "Mother",
      bloodGroup: "AB+",
      allergies: "Dust mites",
      medicalConditions: "Growth monitoring",
      medicalHistory: "Has been followed for slow growth since age 8.",
      img: "/placeholder.svg",
      colorCode: "#FF33B2",
      role: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const filteredPatients = patients.filter(
    (patient) =>
      patient.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.relation.toLowerCase().includes(searchQuery.toLowerCase()) || // Search by relation/guardian
      patient.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewPatient = (patient: Patient) => {
    // Corrected: parameter type to Patient
    setSelectedPatient(patient);
    setShowPatientDetails(true);
  };

  const handleEditPatient = (patient: Patient) => {
    // Corrected: parameter type to Patient
    setSelectedPatient(patient);
    setShowEditPatient(true);
  };

  const handleDeletePatient = (patientId: string) => {
    // ID type should be string for Prisma
    // In a real app, this would be an API call to delete the patient
    console.log("Delete patient:", patientId);
    // You'd typically re-fetch or filter the list here to update the UI
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Patient Management</CardTitle>
              <CardDescription>Add, update, and track your pediatric patients</CardDescription>
            </div>
            <Button onClick={() => setShowAddPatient(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Patient
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="mb-6 flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patients by name, guardian, or email..."
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>

          {/* Patients Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Age/Gender</TableHead>
                  <TableHead>Relation</TableHead> {/* Updated from Guardian */}
                  <TableHead>Contact</TableHead>
                  <TableHead>Last Visit</TableHead>
                  <TableHead>Next Appointment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Conditions</TableHead>
                  <TableHead className="w-[50px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={patient.img || "/placeholder.svg"} />{" "}
                          {/* Use patient.img */}
                          <AvatarFallback>
                            {/* Fallback to first letters of first and last name */}
                            {patient.firstName ? patient.firstName[0] : ""}
                            {patient.lastName ? patient.lastName[0] : ""}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {patient.firstName} {patient.lastName}
                          </p>{" "}
                          {/* Display full name */}
                          <p className="text-muted-foreground text-sm">
                            DOB: {format(patient.dateOfBirth, "PPP")} {/* Format Date object */}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{calculateAge(patient.dateOfBirth)} years</p>{" "}
                        {/* Calculate age */}
                        <p className="text-muted-foreground text-sm">
                          {patient.gender.toLowerCase()}
                        </p>{" "}
                        {/* Display gender */}
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{patient.relation}</p> {/* Use patient.relation */}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{patient.phone}</p>
                        <p className="text-muted-foreground text-sm">{patient.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {/* Placeholder: Replace with actual last visit date from patient.appointments */}
                      <p className="text-sm">{"2024-01-08"}</p>
                    </TableCell>
                    <TableCell>
                      {/* Placeholder: Replace with actual next appointment date from patient.appointments */}
                      <p className="text-sm">{"2024-01-15"}</p>
                    </TableCell>
                    <TableCell>
                      {/* Assuming 'Active' or 'Inactive' based on your logic, otherwise use a field from Patient */}
                      <Badge variant={"default"}>Active {/* Placeholder status */}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {patient.medicalConditions ? ( // Use patient.medicalConditions
                          <Badge variant="outline" className="text-xs">
                            {patient.medicalConditions}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            None
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewPatient(patient)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditPatient(patient)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Patient
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeletePatient(patient.id)} // Pass patient.id (string)
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Patient
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredPatients.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No patients found matching your search.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <AddPatientDialog open={showAddPatient} onOpenChangeAction={setShowAddPatient} />
      {selectedPatient && ( // Only render if a patient is selected
        <>
          <EditPatientDialog
            open={showEditPatient}
            onOpenChangeAction={setShowEditPatient}
            patient={selectedPatient}
          />
          <PatientDetailsDialog
            open={showPatientDetails}
            onOpenChange={setShowPatientDetails}
            patient={selectedPatient}
          />
        </>
      )}
    </div>
  );
}
