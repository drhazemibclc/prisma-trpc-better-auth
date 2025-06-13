import { GrowthChart } from "@/components/growth/growth-chart";
import { MainLayout } from "@/components/layout/main-layout";

export default function PatientGrowthPage() {
  return (
    <MainLayout
      breadcrumbs={[{ href: "/patient", label: "Dashboard" }, { label: "Growth Charts" }]}
    >
      <GrowthChart />
    </MainLayout>
  );
}
