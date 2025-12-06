import MemberDetailEdit from "@/components/Members/MemberDetailEdit";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Member Details | Library Management System",
  description: "View and manage member details",
};

const MemberDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return (
    <main>
      <MemberDetailEdit id={id} />
    </main>
  );
};

export default MemberDetailPage;
