// src/components/patients/edit-patient-dialog.tsx
"use client";

import type { Gender, Patient } from "@prisma/client"; // Import Patient and enums if applicable
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useCallback, useEffect, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { cn } from "@/lib/utils";

// Removed 'date' import from 'zod' as it was unused.

interface EditPatientDialogProps {
  open: boolean;
  // FIX: Replaced 'any' with the actual 'Patient' type from Prisma.
  // Assuming Patient.dateOfBirth is `Date | null` from Prisma for `DateTime` fields.
  patient: Patient | null;
  onOpenChangeAction: (open: boolean) => void;
  // If your onSubmit function expects stringified dates for the API,
  // you might need an intermediate type, or the parent component handles it.
  // For now, let's assume `Partial<Patient>` is correct, meaning `Date` objects are passed.
  onSubmit: (formData: Partial<Patient>) => void;
  isSaving: boolean;
}

interface EditPatientFormData {
  id: string | undefined;
  firstName: string;
  lastName: string;
  dateOfBirth: Date | undefined;
  gender: string; // Or Gender enum if you're using it in the form directly
  address: string;
  phone: string;
  email: string;
  // Updated according to the actual Prisma schema or data structure
  medicalConditions: string;
  allergies: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  relation: string;
  nutritionalStatus: string; // Or a specific enum type if applicable
  img: string;
  // Added guardian fields based on the useUniqueElementIds warnings
  medicalHistory: string; // Based on the medicalHistory ID warning
}

// Helper to initialize form data from a patient object or default values
const initializeFormData = (patient: Patient | null): EditPatientFormData => ({
  firstName: patient?.firstName || "",
  lastName: patient?.lastName || "",
  id: patient?.id,
  // Ensure patient.dateOfBirth is a Date object or convert it if it's a string from API
  dateOfBirth: patient?.dateOfBirth instanceof Date ? patient.dateOfBirth : undefined,
  gender: patient?.gender || "MALE", // Default to MALE or a suitable default
  address: patient?.address || "",
  phone: patient?.phone || "",
  email: patient?.email || "",
  medicalConditions: patient?.medicalConditions || "",
  allergies: patient?.allergies || "",
  emergencyContactName: patient?.emergencyContactName || "",
  emergencyContactNumber: patient?.emergencyContactNumber || "",
  relation: patient?.relation || "",
  nutritionalStatus: patient?.nutritionalStatus || "NORMAL", // Default to a valid status like "NORMAL"
  img: patient?.img || "",
  medicalHistory: patient?.medicalHistory || "", // Initializing medicalHistory
});

// Extracted Form Content Component
interface EditPatientFormContentProps {
  formData: EditPatientFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleDateChange: (date: Date | undefined) => void;
}

const EditPatientFormContent: React.FC<EditPatientFormContentProps> = ({
  formData,
  handleInputChange,
  handleSelectChange,
  handleDateChange,
}) => {
  // Generate unique IDs for form elements
  const idPrefix = useId(); // Generates a unique string like ":r0:"

  const firstNameId = `${idPrefix}-firstName`;
  const lastNameId = `${idPrefix}-lastName`;
  const dateOfBirthId = `${idPrefix}-dateOfBirth`;
  const genderId = `${idPrefix}-gender`;
  const addressId = `${idPrefix}-address`;
  const phoneId = `${idPrefix}-phone`;
  const emailId = `${idPrefix}-email`;
  const medicalConditionsId = `${idPrefix}-medicalConditions`;
  const allergiesId = `${idPrefix}-allergies`; // Unique ID
  const medicalHistoryId = `${idPrefix}-medicalHistory`; // Unique ID
  const emergencyContactNameId = `${idPrefix}-emergencyContactName`;
  const emergencyContactNumberId = `${idPrefix}-emergencyContactNumber`;
  const relationId = `${idPrefix}-relation`;
  const nutritionalStatusId = `${idPrefix}-nutritionalStatus`;
  const imgId = `${idPrefix}-img`;
  return (
    <div className="grid gap-4 py-4">
      {/* Patient Information Section */}
      <h3 className="col-span-full mb-4 border-b pb-2 font-semibold text-lg">
        Patient Information
      </h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={firstNameId}>First Name *</Label>
          <Input
            id={firstNameId} // FIX: Used generated ID
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={lastNameId}>Last Name *</Label>
          <Input
            id={lastNameId} // FIX: Used generated ID
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={dateOfBirthId}>Date of Birth *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.dateOfBirth && "text-muted-foreground"
                )}
                id={dateOfBirthId} // FIX: Used generated ID
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.dateOfBirth ? (
                  format(formData.dateOfBirth, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.dateOfBirth}
                onSelect={handleDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label htmlFor={genderId}>Gender *</Label>
          <Select
            name="gender"
            value={formData.gender}
            onValueChange={(value) => handleSelectChange("gender", value)}
          >
            <SelectTrigger className="w-full" id={genderId}>
              {" "}
              {/* FIX: Used generated ID */}
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MALE">Male</SelectItem>
              <SelectItem value="FEMALE">Female</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={addressId}>Address *</Label>
          <Input
            id={addressId} // FIX: Used generated ID
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={phoneId}>Phone Number *</Label>
          <Input
            id={phoneId} // FIX: Used generated ID
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            type="tel"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={emailId}>Email Address</Label>
        <Input
          id={emailId} // FIX: Used generated ID
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          type="email"
        />
      </div>

      {/* Guardian Information Section */}
      <h3 className="col-span-full mt-6 mb-4 border-b pb-2 font-semibold text-lg">
        Guardian Information
      </h3>

      {/* Medical Information Section */}
      <h3 className="col-span-full mt-6 mb-4 border-b pb-2 font-semibold text-lg">
        Medical Information
      </h3>
      <div className="space-y-2">
        <Label htmlFor={allergiesId}>Known Allergies</Label>
        <Textarea
          id={allergiesId} // FIX: Used generated ID
          name="allergies"
          value={formData.allergies}
          onChange={handleInputChange}
          rows={2}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={medicalHistoryId}>Medical History</Label>
        <Textarea
          id={medicalHistoryId} // FIX: Used generated ID
          name="medicalHistory"
          value={formData.medicalHistory}
          onChange={handleInputChange}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={medicalConditionsId}>Medical Conditions</Label>
        <Textarea
          id={medicalConditionsId}
          name="medicalConditions"
          value={formData.medicalConditions}
          onChange={handleInputChange}
          rows={3}
        />
      </div>

      {/* Other Patient Details */}
      <h3 className="col-span-full mt-6 mb-4 border-b pb-2 font-semibold text-lg">Other Details</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={emergencyContactNameId}>Emergency Contact Name</Label>
          <Input
            id={emergencyContactNameId}
            name="emergencyContactName"
            value={formData.emergencyContactName}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={emergencyContactNumberId}>Emergency Contact Phone</Label>
          <Input
            id={emergencyContactNumberId}
            name="emergencyContactNumber"
            value={formData.emergencyContactNumber}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor={relationId}>Relation to Patient</Label>
        <Input
          id={relationId}
          name="relation"
          value={formData.relation}
          onChange={handleInputChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={nutritionalStatusId}>Nutritional Status</Label>
        <Select
          name="nutritionalStatus"
          value={formData.nutritionalStatus}
          onValueChange={(value) => handleSelectChange("nutritionalStatus", value)}
        >
          <SelectTrigger className="w-full" id={nutritionalStatusId}>
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NORMAL">Normal</SelectItem>
            <SelectItem value="MALNOURISHED">Malnourished</SelectItem>
            <SelectItem value="OVERWEIGHT">Overweight</SelectItem>
            <SelectItem value="UNDERWEIGHT">Underweight</SelectItem> {/* Added common status */}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor={imgId}>Image URL</Label>
        <Input id={imgId} name="img" value={formData.img} onChange={handleInputChange} />
      </div>
    </div>
  );
};

export function EditPatientDialog({
  open,
  patient,
  onOpenChangeAction,
  onSubmit,
  isSaving,
}: EditPatientDialogProps) {
  const [formData, setFormData] = useState<EditPatientFormData>(() => initializeFormData(patient));

  useEffect(() => {
    // Only update form data if the dialog is opening AND the patient prop changes
    // This prevents resetting the form while user is typing if `patient` reference changes for other reasons.
    if (open && patient?.id !== formData.id) {
      // Assuming patient has an 'id' field
      setFormData(initializeFormData(patient));
    } else if (open && !patient) {
      // For adding a new patient (no patient prop)
      setFormData(initializeFormData(null));
    }
  }, [patient, open, formData.id]); // Depend on `patient` and `open`

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleSelectChange = useCallback((name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleDateChange = useCallback((date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, dateOfBirth: date }));
  }, []);

  const handleSubmit = useCallback(async () => {
    // Convert Date object to ISO string for submission if your backend expects it
    const dataToSubmit: Partial<Patient> = {
      ...formData,
      // Convert dateOfBirth to ISO string or null for API submission
      dateOfBirth: formData.dateOfBirth || undefined, // Assigns Date | null
      // Ensure other nullable fields are handled correctly if they can be empty strings in form
      medicalConditions: formData.medicalConditions || null,
      allergies: formData.allergies || null,
      emergencyContactName: formData.emergencyContactName || undefined,
      emergencyContactNumber: formData.emergencyContactNumber || undefined,
      relation: formData.relation || undefined,
      gender: formData.gender as Gender,
      nutritionalStatus: formData.nutritionalStatus || null, // Assuming this can be nullable in DB
      img: formData.img || null,
      medicalHistory: formData.medicalHistory || null,
    };
    onSubmit(dataToSubmit);
  }, [formData, onSubmit]);

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      {" "}
      {/* Changed onOpenChange to onOpenChangeAction */}
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[425px] md:max-w-xl lg:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{patient ? "Edit Patient" : "Add New Patient"}</DialogTitle>
          <DialogDescription>
            {patient ? "Make changes to patient details here." : "Add a new patient to the system."}
          </DialogDescription>
        </DialogHeader>

        <EditPatientFormContent
          formData={formData}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
          handleDateChange={handleDateChange}
        />

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChangeAction(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
