import { MainLayout } from "@/components/layout/main-layout";
import { MedicalRecordViewer } from "@/components/medical-records/medical-record-viewer";

export default function PatientRecordsPage() {
  return (
    <MainLayout
      breadcrumbs={[{ href: "/patient", label: "Dashboard" }, { label: "Medical Records" }]}
    >
      <MedicalRecordViewer />
    </MainLayout>
  );
}
