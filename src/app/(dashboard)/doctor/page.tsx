import { DoctorDashboard } from "@/components/dashboard/doctor-dashboard";
import { MainLayout } from "@/components/layout/main-layout";

export default function DoctorDashboardPage() {
  return (
    <MainLayout breadcrumbs={[{ label: "Doctor Dashboard" }]}>
      <DoctorDashboard />
    </MainLayout>
  );
}
