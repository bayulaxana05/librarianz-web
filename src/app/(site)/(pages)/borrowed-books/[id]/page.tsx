import BorrowedBookDetailEdit from "@/components/BorrowedBooks/BorrowedBookDetailEdit";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Borrowed Book Details | Library Management",
  description: "View and manage borrowed book details",
};

const BorrowedBookDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return (
    <main>
      <BorrowedBookDetailEdit id={id} />
    </main>
  );
};

export default BorrowedBookDetailPage;
