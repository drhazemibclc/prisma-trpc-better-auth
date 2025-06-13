"use client";

import type { Gender } from "@prisma/client"; // Import Gender enum from Prisma
import { format } from "date-fns";
import { CalendarIcon, Plus } from "lucide-react";
import type React from "react";
import { useId, useState } from "react";
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

interface AddPatientDialogProps {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
}

export function AddPatientDialog({ open, onOpenChangeAction }: AddPatientDialogProps) {
  // Generate unique IDs for all form elements
  const firstNameId = useId();
  const lastNameId = useId();
  const dateOfBirthId = useId();
  const genderId = useId();
  const phoneId = useId();
  const emailId = useId();
  const nutritionalStatusId = useId();
  const addressId = useId();
  const emergencyContactNameId = useId();
  const emergencyContactNumberId = useId();
  const relationId = useId(); // Corresponds to guardianName in previous versions
  const bloodGroupId = useId(); // Corresponds to bloodType
  const allergiesId = useId();
  const medicalConditionsId = useId(); // New field from schema
  const medicalHistoryId = useId();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: undefined as Date | undefined,
    gender: "" as Gender | "", // Use Prisma's Gender enum type
    phone: "",
    email: "",
    nutritionalStatus: "", // New field from schema
    address: "",
    emergencyContactName: "", // Updated to match schema
    emergencyContactNumber: "", // Updated to match schema
    relation: "", // Updated to match schema (was guardianName)
    bloodGroup: "", // Updated to match schema (was bloodType)
    allergies: "",
    medicalConditions: "", // New field from schema
    medicalHistory: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you'd send formData to your tRPC API or similar
    console.log("Adding patient:", formData);
    onOpenChangeAction(false);
    // Reset form after submission
    setFormData({
      firstName: "",
      lastName: "",
      dateOfBirth: undefined,
      gender: "",
      phone: "",
      email: "",
      nutritionalStatus: "",
      address: "",
      emergencyContactName: "",
      emergencyContactNumber: "",
      relation: "",
      bloodGroup: "",
      allergies: "",
      medicalConditions: "",
      medicalHistory: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Patient</DialogTitle>
          <DialogDescription>
            Enter the patient's information to create a new medical record.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Patient Information */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Patient Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={firstNameId}>First Name *</Label>
                <Input
                  id={firstNameId}
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={lastNameId}>Last Name *</Label>
                <Input
                  id={lastNameId}
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={dateOfBirthId}>Date of Birth *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.dateOfBirth && "text-muted-foreground"
                      )}
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
                      selected={formData.dateOfBirth}
                      onSelect={(date: Date | undefined) =>
                        setFormData({ ...formData, dateOfBirth: date })
                      }
                      mode="single"
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor={genderId}>Gender *</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(
                    value: Gender // Ensure this matches Prisma Gender enum
                  ) => setFormData({ ...formData, gender: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BOY">Boy</SelectItem>
                    <SelectItem value="GIRL">Girl</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={phoneId}>Phone Number *</Label>
                <Input
                  id={phoneId}
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  type="tel"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={emailId}>Email Address *</Label>
                <Input
                  id={emailId}
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  type="email"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={bloodGroupId}>Blood Group</Label>
                <Select
                  value={formData.bloodGroup}
                  onValueChange={(value: string) => setFormData({ ...formData, bloodGroup: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor={nutritionalStatusId}>Nutritional Status</Label>
                <Input
                  id={nutritionalStatusId}
                  value={formData.nutritionalStatus}
                  onChange={(e) => setFormData({ ...formData, nutritionalStatus: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={addressId}>Address *</Label>
              <Textarea
                id={addressId}
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={2}
              />
            </div>
          </div>

          {/* Guardian/Relation Information */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Guardian / Relation Information</h3>
            <div className="space-y-2">
              <Label htmlFor={relationId}>Relation to Patient (e.g., Parent, Guardian) *</Label>
              <Input
                id={relationId}
                required
                value={formData.relation}
                onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
              />
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Emergency Contact</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={emergencyContactNameId}>Emergency Contact Name *</Label>
                <Input
                  id={emergencyContactNameId}
                  required
                  value={formData.emergencyContactName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergencyContactName: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={emergencyContactNumberId}>Emergency Contact Number *</Label>
                <Input
                  id={emergencyContactNumberId}
                  required
                  value={formData.emergencyContactNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, emergencyContactNumber: e.target.value })
                  }
                  type="tel"
                />
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Medical Information</h3>
            <div className="space-y-2">
              <Label htmlFor={allergiesId}>Known Allergies</Label>
              <Textarea
                id={allergiesId}
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                placeholder="List any known allergies..."
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={medicalConditionsId}>Medical Conditions</Label>
              <Textarea
                id={medicalConditionsId}
                value={formData.medicalConditions}
                onChange={(e) => setFormData({ ...formData, medicalConditions: e.target.value })}
                placeholder="List any existing medical conditions..."
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={medicalHistoryId}>Medical History</Label>
              <Textarea
                id={medicalHistoryId}
                value={formData.medicalHistory}
                onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                placeholder="Previous medical conditions, surgeries, etc..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChangeAction(false)} type="button">
              Cancel
            </Button>
            <Button type="submit">
              <Plus className="mr-2 h-4 w-4" />
              Add Patient
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
