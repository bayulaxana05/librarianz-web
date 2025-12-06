import React from "react";
import AuthorDetailEdit from "@/components/Authors/AuthorDetailEdit";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Author Detail | Library Management System",
  description: "View and edit an author",
};

const AuthorPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return (
    <main>
      <AuthorDetailEdit id={id} />
    </main>
  );
};

export default AuthorPage;
