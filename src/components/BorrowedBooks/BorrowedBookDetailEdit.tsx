"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { useRouter } from "next/navigation";
import { API_ENDPOINTS } from "@/utils/api";

interface Author {
  id: number;
  name: string;
}

interface Book {
  id: number;
  title: string;
  category: string;
  publishedYear: number;
  author: Author;
}

interface Member {
  id: number;
  name: string;
  username: string;
  email: string;
  phoneNumber: string;
  address: string;
}

interface BorrowedBookDetail {
  id: number | string;
  book: Book;
  member: Member;
  borrowDate: string;
  returnDate: string | null;
  createdAt?: string;
  updatedAt?: string;
}

interface PaginatedResponse<T> {
  content?: T[];
  totalPages?: number;
}

const BorrowedBookDetailEdit = ({ id }: { id: string }) => {
  const [borrowedBook, setBorrowedBook] = useState<BorrowedBookDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [books, setBooks] = useState<Book[]>([]);
  const [bookQuery, setBookQuery] = useState("");
  const [loadingBooks, setLoadingBooks] = useState<boolean>(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showBookSearch, setShowBookSearch] = useState(false);

  const [borrowDate, setBorrowDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const router = useRouter();

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
    const fetchBorrowedBook = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_ENDPOINTS.BORROWED_BOOKS}/${id}`);
        if (!response.ok) throw new Error("Failed to fetch borrowed book");
        const data: BorrowedBookDetail = await response.json();
        setBorrowedBook(data);
        setSelectedBook(data.book);
        setBorrowDate(data.borrowDate || "");
        setReturnDate(data.returnDate || "");
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchBorrowedBook();
    fetchBooks();
  }, [id, fetchBooks]);

  const handleBookSearch = async () => {
    await fetchBooks(bookQuery.trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBook) {
      setError("Please select a book");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const payload = {
        book: {id: selectedBook.id},
        borrowDate: borrowDate || borrowedBook?.borrowDate,
        returnDate: returnDate || null,
      };

      const response = await fetch(`${API_ENDPOINTS.BORROWED_BOOKS}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to update borrowed book");
      }

      const updated: BorrowedBookDetail = await response.json();
      setBorrowedBook(updated);
      setSelectedBook(updated.book);
      setSuccessMessage("Borrowed book updated successfully.");
      setShowBookSearch(false);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const bookList = useMemo(() => (
    <div className="bg-white rounded-xl shadow-1 p-5 mt-3 max-h-80 overflow-y-auto">
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
                onClick={() => {
                  setSelectedBook(book);
                  setShowBookSearch(false);
                }}
                className={`text-left py-3 px-3 rounded-md transition border ${
                  isSelected ? "border-blue bg-blue/5" : "border-transparent hover:border-gray-3"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-dark">{book.title}</p>
                    <p className="text-sm text-gray-600">{book.author.name}</p>
                    <p className="text-xs text-gray-600">Category: {book.category}</p>
                  </div>
                  {isSelected && <span className="text-blue text-sm font-medium">✓</span>}
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
      <Breadcrumb
        title={borrowedBook ? `Borrowed: ${borrowedBook.book.title}` : "Borrowed Book"}
        pages={["borrowed-books", "detail"]}
      />

      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-col xl:flex-row gap-7.5">
            {/* Left Info Column */}
            <div className="xl:max-w-[370px] w-full bg-white rounded-xl shadow-1">
              <div className="py-5 px-4 sm:px-7.5 border-b border-gray-3">
                <p className="font-medium text-xl text-dark">Borrowed Book Detail</p>
              </div>

              <div className="p-4 sm:p-7.5">
                {loading ? (
                  <p>Loading borrowed book...</p>
                ) : error ? (
                  <p className="text-red-500">Error: {error}</p>
                ) : borrowedBook ? (
                  <div className="flex flex-col gap-4">
                    <div>
                      <p className="font-medium text-dark">Book</p>
                      <p className="text-gray-600">{borrowedBook.book.title}</p>
                      <p className="text-xs text-gray-600">{borrowedBook.book.author.name}</p>
                    </div>

                    <div>
                      <p className="font-medium text-dark">Member</p>
                      <p className="text-gray-600">{borrowedBook.member.name}</p>
                      <p className="text-xs text-gray-600">@{borrowedBook.member.username}</p>
                    </div>

                    <div>
                      <p className="font-medium text-dark">Borrow Date</p>
                      <p className="text-gray-600">
                        {new Date(borrowedBook.borrowDate).toLocaleDateString()}
                      </p>
                    </div>

                    <div>
                      <p className="font-medium text-dark">Return Date</p>
                      <p className="text-gray-600">
                        {borrowedBook.returnDate
                          ? new Date(borrowedBook.returnDate).toLocaleDateString()
                          : "Not returned"}
                      </p>
                    </div>

                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => router.push("/borrowed-books")}
                        className="inline-flex font-medium text-white bg-gray-600 py-2 px-4 rounded-md hover:bg-gray-700"
                      >
                        Back
                      </button>
                    </div>
                  </div>
                ) : (
                  <p>No borrowed book found.</p>
                )}
              </div>
            </div>

            {/* Right Edit Form Column */}
            <div className="xl:max-w-[770px] w-full bg-white rounded-xl shadow-1 p-4 sm:p-7.5 xl:p-10">
              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label className="block mb-2.5">
                    Member <span className="text-red">*</span>
                  </label>
                  <input
                    type="text"
                    disabled
                    value={borrowedBook?.member.name || ""}
                    className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20 disabled:bg-gray-2 disabled:cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-600 mt-1">Member cannot be changed</p>
                </div>

                <div className="mb-5">
                  <label className="block mb-2.5">
                    Book <span className="text-red">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowBookSearch(!showBookSearch)}
                    className="w-full rounded-md border border-gray-3 bg-white placeholder:text-dark-5 py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20 text-left font-medium text-dark hover:bg-gray-1 transition"
                  >
                    {selectedBook ? selectedBook.title : "Click to select a book"}
                  </button>

                  {showBookSearch && (
                    <div className="mt-3">
                      <div className="flex flex-col md:flex-row gap-3 mb-3">
                        <input
                          type="text"
                          value={bookQuery}
                          onChange={(e) => setBookQuery(e.target.value)}
                          placeholder="Search books by title"
                          className="flex-1 rounded-md border border-gray-3 bg-white placeholder:text-dark-5 py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                        />
                        <button
                          type="button"
                          onClick={handleBookSearch}
                          className="text-white bg-blue py-2.5 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark font-medium"
                        >
                          Search
                        </button>
                      </div>
                      {bookList}
                    </div>
                  )}

                  {selectedBook && (
                    <div className="mt-3 p-3 rounded-md border border-blue bg-blue/5">
                      <p className="font-medium text-dark">{selectedBook.title}</p>
                      <p className="text-sm text-gray-600">{selectedBook.author.name}</p>
                      <p className="text-xs text-gray-600">Category: {selectedBook.category}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
                  <div className="w-full">
                    <label htmlFor="borrowDate" className="block mb-2.5">
                      Borrow Date <span className="text-red">*</span>
                    </label>
                    <input
                      id="borrowDate"
                      type="date"
                      value={borrowDate}
                      onChange={(e) => setBorrowDate(e.target.value)}
                      className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    />
                  </div>

                  <div className="w-full">
                    <label htmlFor="returnDate" className="block mb-2.5">
                      Return Date
                    </label>
                    <input
                      id="returnDate"
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    />
                  </div>
                </div>

                {error && <p className="text-red-500 mb-3">{error}</p>}
                {successMessage && <p className="text-green-600 mb-3">{successMessage}</p>}

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md ease-out duration-200 hover:bg-blue-dark disabled:opacity-60"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (borrowedBook) {
                        setSelectedBook(borrowedBook.book);
                        setBorrowDate(borrowedBook.borrowDate || "");
                        setReturnDate(borrowedBook.returnDate || "");
                        setSuccessMessage(null);
                        setError(null);
                      }
                    }}
                    className="inline-flex font-medium text-dark bg-gray-1 py-3 px-5 rounded-md hover:bg-gray-2"
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BorrowedBookDetailEdit;
