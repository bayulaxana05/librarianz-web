"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { API_ENDPOINTS } from "@/utils/api";

interface Member {
  id: string;
  name: string;
  username: string;
  email: string;
}

interface Book {
  id: string | number;
  title: string;
  author?: { name?: string };
  category?: string;
}

interface PaginatedResponse<T> {
  content?: T[];
  totalPages?: number;
}

const steps = [
  { id: 1, title: "Choose Member" },
  { id: 2, title: "Choose Book" },
];

const CreateBorrowedBook: React.FC = () => {
  const router = useRouter();

  const [activeStep, setActiveStep] = useState<number>(1);
  const [members, setMembers] = useState<Member[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [memberQuery, setMemberQuery] = useState("");
  const [bookQuery, setBookQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [loadingMembers, setLoadingMembers] = useState<boolean>(false);
  const [loadingBooks, setLoadingBooks] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = useCallback(async (search?: string) => {
    try {
      setLoadingMembers(true);
      setError(null);

      const params = new URLSearchParams({ page: "1", size: "20" });
      if (search) {
        params.set("search", search);
      }

      const response = await fetch(`${API_ENDPOINTS.MEMBERS}?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch members");
      }

      const data: PaginatedResponse<Member> | Member[] = await response.json();
      if (Array.isArray(data)) {
        setMembers(data);
      } else {
        setMembers(data.content || []);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch members";
      setError(message);
    } finally {
      setLoadingMembers(false);
    }
  }, []);

  const fetchBooks = useCallback(async (search?: string) => {
    try {
      setLoadingBooks(true);
      setError(null);

      const params = new URLSearchParams({ page: "1", size: "20" });
      if (search) {
        params.set("search", search);
      }

      const response = await fetch(`${API_ENDPOINTS.BOOKS}?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }

      const data: PaginatedResponse<Book> | Book[] = await response.json();
      if (Array.isArray(data)) {
        setBooks(data);
      } else {
        setBooks(data.content || []);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch books";
      setError(message);
    } finally {
      setLoadingBooks(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
    fetchBooks();
  }, [fetchMembers, fetchBooks]);

  const handleMemberSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetchMembers(memberQuery.trim());
  };

  const handleBookSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetchBooks(bookQuery.trim());
  };

  const handleNext = () => {
    if (activeStep === 1 && selectedMember) {
      setActiveStep(2);
    }
  };

  const handleBack = () => {
    if (activeStep === 2) {
      setActiveStep(1);
    }
  };

  const handleSave = async () => {
    if (!selectedMember || !selectedBook) return;

    try {
      setSaving(true);
      setError(null);

      const payload = {
        member: {id: selectedMember.id},
        book: {id: selectedBook.id},
        borrowDate: new Date().toISOString().split("T")[0],
        returnDate: null,
      };

      const response = await fetch(API_ENDPOINTS.BORROWED_BOOKS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to create borrowed book");
      }

      setSelectedBook(null);
      setSelectedMember(null);
      alert("Borrowed book created successfully");
      router.push(`/members/${payload.member.id}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save borrowed book";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const memberList = useMemo(() => (
    <div className="bg-white rounded-xl shadow-1 p-5 mt-5">
      {loadingMembers ? (
        <p className="text-gray-600">Loading members...</p>
      ) : members.length === 0 ? (
        <p className="text-gray-600">No members found.</p>
      ) : (
        <div className="flex flex-col divide-y divide-gray-3">
          {members.map((member) => {
            const isSelected = selectedMember?.id === member.id;
            return (
              <button
                type="button"
                key={member.id}
                onClick={() => setSelectedMember(member)}
                className={`text-left py-4 px-4 rounded-md transition border ${
                  isSelected ? "border-blue bg-blue/5" : "border-transparent hover:border-gray-3"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-dark">{member.name}</p>
                    <p className="text-sm text-gray-600">@{member.username}</p>
                    <p className="text-sm text-gray-600">{member.email}</p>
                  </div>
                  {isSelected && (
                    <span className="text-blue text-sm font-medium">Selected</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  ), [loadingMembers, members, selectedMember]);

  const bookList = useMemo(() => (
    <div className="bg-white rounded-xl shadow-1 p-5 mt-5">
      {loadingBooks ? (
        <p className="text-gray-600">Loading books...</p>
      ) : books.length === 0 ? (
        <p className="text-gray-600">No books found.</p>
      ) : (
        <div className="flex flex-col divide-y divide-gray-3">
          {books.map((book) => {
            const isSelected = selectedBook?.id === book.id;
            return (
              <button
                type="button"
                key={book.id}
                onClick={() => setSelectedBook(book)}
                className={`text-left py-4 px-4 rounded-md transition border ${
                  isSelected ? "border-blue bg-blue/5" : "border-transparent hover:border-gray-3"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-dark">{book.title}</p>
                    <p className="text-sm text-gray-600">{book.author?.name || "Unknown Author"}</p>
                    {book.category && (
                      <p className="text-sm text-gray-600">Category: {book.category}</p>
                    )}
                  </div>
                  {isSelected && (
                    <span className="text-blue text-sm font-medium">Selected</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  ), [loadingBooks, books, selectedBook]);

  return (
    <>
      <Breadcrumb title="Create Borrowed Book" pages={["borrowed-books", "create"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-col xl:flex-row gap-7.5">
            {/* Left Stepper Column */}
            <div className="xl:max-w-[320px] w-full bg-white rounded-xl shadow-1">
              <div className="p-4 sm:p-7.5 xl:p-9">
                <div className="flex flex-col gap-4">
                  {steps.map((step) => {
                    const isActive = activeStep === step.id;
                    const isComplete = activeStep > step.id;
                    return (
                      <button
                        key={step.id}
                        type="button"
                        onClick={() => {
                          if (step.id === 1 || selectedMember) {
                            setActiveStep(step.id);
                          }
                        }}
                        className={`flex items-center rounded-md gap-3 py-3 px-4.5 text-left border ease-out duration-200 ${
                          isActive
                            ? "bg-blue text-white border-blue"
                            : isComplete
                              ? "bg-gray-1 text-dark border-gray-3"
                              : "bg-gray-1 text-dark-2 border-gray-3"
                        }`}
                      >
                        <span className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                          isActive ? "border-white" : "border-blue"
                        } ${isActive ? "bg-blue text-white" : "text-blue"}`}>
                          {step.id}
                        </span>
                        <div>
                          <p className="font-medium">{step.title}</p>
                          <p className="text-xs text-dark-5">Required</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Content Column */}
            <div className="xl:max-w-[770px] w-full">
              <div className="bg-white rounded-xl shadow-1 py-9.5 px-4 sm:px-7.5 xl:px-10">
                {error && (
                  <div className="mb-5 p-4 rounded-md bg-red/5 text-red border border-red/30">
                    {error}
                  </div>
                )}

                {activeStep === 1 && (
                  <div>
                    <h3 className="text-xl font-medium text-dark mb-4">Choose Member</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Search by name, username, or email. Showing up to 20 results.
                    </p>
                    <form onSubmit={handleMemberSearch} className="flex flex-col md:flex-row gap-3">
                      <input
                        type="text"
                        value={memberQuery}
                        onChange={(e) => setMemberQuery(e.target.value)}
                        placeholder="Search members by name, username, or email"
                        className="flex-1 rounded-md border border-gray-3 bg-white placeholder:text-dark-5 py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                      />
                      <button
                        type="submit"
                        className="text-white bg-blue py-2.5 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark font-medium"
                      >
                        Search
                      </button>
                    </form>
                    {memberList}

                    <div className="flex justify-end mt-6">
                      <button
                        type="button"
                        onClick={handleNext}
                        disabled={!selectedMember}
                        className="inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md ease-out duration-200 hover:bg-blue-dark disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next: Choose Book
                      </button>
                    </div>
                  </div>
                )}

                {activeStep === 2 && (
                  <div>
                    <h3 className="text-xl font-medium text-dark mb-4">Choose Book</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Search by book title. Showing up to 20 results.
                    </p>

                    {selectedMember && (
                      <div className="mb-5 p-4 rounded-md border border-gray-3 bg-gray-1">
                        <p className="font-medium text-dark">Selected Member</p>
                        <p className="text-sm text-gray-600">{selectedMember.name} (@{selectedMember.username})</p>
                        <p className="text-sm text-gray-600">{selectedMember.email}</p>
                      </div>
                    )}

                    <form onSubmit={handleBookSearch} className="flex flex-col md:flex-row gap-3">
                      <input
                        type="text"
                        value={bookQuery}
                        onChange={(e) => setBookQuery(e.target.value)}
                        placeholder="Search books by title"
                        className="flex-1 rounded-md border border-gray-3 bg-white placeholder:text-dark-5 py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                      />
                      <button
                        type="submit"
                        className="text-white bg-blue py-2.5 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark font-medium"
                      >
                        Search
                      </button>
                    </form>

                    {bookList}

                    <div className="flex justify-between mt-6 gap-3">
                      <button
                        type="button"
                        onClick={handleBack}
                        className="inline-flex font-medium text-dark-2 bg-gray-1 py-3 px-7 rounded-md ease-out duration-200 hover:bg-gray-3"
                      >
                        Back
                      </button>

                      <button
                        type="button"
                        onClick={handleSave}
                        disabled={!selectedBook || saving}
                        className="inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md ease-out duration-200 hover:bg-blue-dark disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {saving ? "Saving..." : "Save Borrowed Book"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CreateBorrowedBook;
