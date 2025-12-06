import CreateBorrowedBook from "@/components/BorrowedBooks/CreateBorrowedBook";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Borrowed Book | Library Management",
  description: "Create a borrowed book record by selecting a member and a book.",
};

export default function CreateBorrowedBookPage() {
  return (
    <main>
      <CreateBorrowedBook />
    </main>
  );
}
