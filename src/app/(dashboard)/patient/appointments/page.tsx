import { AppointmentCalendar } from "@/components/appointments/appointment-calendar";
import { MainLayout } from "@/components/layout/main-layout";

export default function PatientAppointmentsPage() {
  return (
    <MainLayout breadcrumbs={[{ href: "/patient", label: "Dashboard" }, { label: "Appointments" }]}>
      <AppointmentCalendar />
    </MainLayout>
  );
}
