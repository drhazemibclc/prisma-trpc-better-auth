import { PatientDashboard } from "@/components/dashboard/patient-dashboard";
import { MainLayout } from "@/components/layout/main-layout";

export default function PatientDashboardPage() {
  return (
    <MainLayout breadcrumbs={[{ label: "Dashboard" }]}>
      <PatientDashboard />
    </MainLayout>
  );
}
