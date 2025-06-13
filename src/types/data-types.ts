import type { AppointmentStatus, Doctor, Patient } from "@prisma/client";
import type z from "zod";
import type {
  AppointmentSchema,
  DiagnosisSchema,
  DoctorSchema,
  PatientBillSchema,
  PatientFormSchema,
  PaymentSchema,
  ServicesSchema,
  StaffSchema,
  VitalSignsSchema,
  WorkingDaysSchema,
} from "@/lib/schema";

export type AppointmentsChartProps = {
  appointment: number;
  completed: number;
  name: string;
}[];

export type Appointment = {
  id: number;
  appointment_date: Date;
  doctor: Doctor;
  doctor_id: string;
  patient: Patient;
  patient_id: string;
  status: AppointmentStatus;
  time: string;
  type: string;
};

export type AvailableDoctorProps = {
  id: string;
  name: string;
  specialization: string;
  working_days: {
    close_time: string;
    day: string;
    start_time: string;
  }[];
  colorCode?: string;
  img?: string;
}[];

export type PartialPatient = {
  colorCode: string | null;
  first_name: string;
  gender: string;
  img: string | null;
  last_name: string;
};

export type PartialDoctor = {
  colorCode: string | null;
  img: string | null;
  name: string;
  specialization: string;
};

export type PartialAppointment = {
  id: number;
  appointment_date: Date;
  doctor: PartialDoctor;
  patient: PartialPatient;
  status: AppointmentStatus;
  time: string;
};

export type PatientInput = z.infer<typeof PatientFormSchema>;
export type StaffInput = z.infer<typeof StaffSchema>;
export type DoctorInput = z.infer<typeof DoctorSchema>;
export type ServiceInput = z.infer<typeof ServicesSchema>;
export type WorkScheduleInput = z.infer<typeof WorkingDaysSchema>;
export type AppointmentInput = z.infer<typeof AppointmentSchema>;
export type VitalSignsInput = z.infer<typeof VitalSignsSchema>;
export type DiagnosisInput = z.infer<typeof DiagnosisSchema>;
export type PaymentInput = z.infer<typeof PaymentSchema>;
export type PatientBillInput = z.infer<typeof PatientBillSchema>;
export type ServicesInput = z.infer<typeof ServicesSchema>;
