import BorrowedBooksList from "@/components/BorrowedBooks";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Borrowed Books | Library Management",
  description: "View and manage all borrowed books",
};

export default function BorrowedBooksPage() {
  return (
    <main>
      <BorrowedBooksList />
    </main>
  );
}
