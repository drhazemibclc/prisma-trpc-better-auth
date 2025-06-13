import { MessageCenter } from "@/components/communication/message-center";
import { MainLayout } from "@/components/layout/main-layout";

export default function PatientMessagesPage() {
  return (
    <MainLayout breadcrumbs={[{ href: "/patient", label: "Dashboard" }, { label: "Messages" }]}>
      <MessageCenter />
    </MainLayout>
  );
}
