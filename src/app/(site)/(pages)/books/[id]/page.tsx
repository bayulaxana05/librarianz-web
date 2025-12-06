import BookDetailEdit from "@/components/Books/BookDetailEdit";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Details | Library Management System",
  description: "View and edit a book",
};

const BookPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return (
    <main>
      <BookDetailEdit id={id} />
    </main>
  );
};

export default BookPage;
