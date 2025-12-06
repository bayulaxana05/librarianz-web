"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Breadcrumb from "../Common/Breadcrumb";
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

interface BorrowedBook {
  id: number | string;
  book: Book;
  member: Member;
  borrowDate: string;
  returnDate: string | null;
  createdAt?: string;
  updatedAt?: string;
}

interface BorrowedBooksResponse {
  content: BorrowedBook[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
}

const BorrowedBooksList = () => {
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPage = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("size") || "10");
  const queryParam = searchParams.get("search") || "";

  const fetchBorrowedBooks = React.useCallback(async (page: number, search?: string) => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      params.set("page", page.toString());
      params.set("size", pageSize.toString());
      if (search) {
        params.set("search", search);
      }

      const response = await fetch(`${API_ENDPOINTS.BORROWED_BOOKS}?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch borrowed books");
      }

      const data: BorrowedBooksResponse = await response.json();
      setBorrowedBooks(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching borrowed books:", err);
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  useEffect(() => {
    fetchBorrowedBooks(currentPage, queryParam);
  }, [currentPage, pageSize, queryParam, fetchBorrowedBooks]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", page.toString());
      router.push(`?${params.toString()}`);
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) {
      params.set("search", searchQuery);
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handleRowClick = (id: string | number) => {
    router.push(`/borrowed-books/${String(id)}`);
  };

  const handleDeleteBorrowedBook = async (id: string | number, bookTitle: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete this borrowed book record for "${bookTitle}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`${API_ENDPOINTS.BORROWED_BOOKS}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to delete borrowed book");
      }

      // Remove the deleted borrowed book from the list
      setBorrowedBooks((prevBooks) =>
        prevBooks.filter((book) => book.id !== id)
      );

      alert("Borrowed book deleted successfully");
    } catch (err) {
      console.error("Error deleting borrowed book:", err);
      alert(
        `Failed to delete borrowed book: ${err instanceof Error ? err.message : "An error occurred"}`
      );
    }
  };

  if (error) {
    return (
      <>
        <Breadcrumb title="Borrowed Books" pages={["borrowed-books"]} />
        <section className="overflow-hidden py-20 bg-gray-2">
          <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
            <div className="text-center text-red-500">
              <p>Error: {error}</p>
              <p className="mt-2 text-sm text-gray-600">
                Make sure the backend API is running on http://localhost:8080
              </p>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Breadcrumb title="Borrowed Books" pages={["borrowed-books"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-wrap items-center justify-between gap-5 mb-7.5">
            <h2 className="font-medium text-dark text-2xl">All Borrowed Books</h2>
            <button
              onClick={() => router.push("/borrowed-books/create")}
              className="text-blue hover:text-blue-dark transition"
            >
              Create Borrowed Book
            </button>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="mb-7.5">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Search borrowed books by book title or member name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 rounded-md border border-gray-3 bg-white placeholder:text-dark-5 py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
              />
              <button
                type="submit"
                className="text-white bg-blue py-2.5 px-7 rounded-md ease-out duration-200 hover:bg-blue-dark font-medium"
              >
                Search
              </button>
              {queryParam && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    router.push("?page=1");
                  }}
                  className="text-dark-2 bg-gray-1 py-2.5 px-7 rounded-md ease-out duration-200 hover:bg-gray-3 font-medium"
                >
                  Clear
                </button>
              )}
            </div>
            {queryParam && (
              <p className="text-sm text-gray-600 mt-2">
                Search results for: <strong>&quot;{queryParam}&quot;</strong>
              </p>
            )}
          </form>

          {loading ? (
            <div className="text-center py-10">
              <p>Loading borrowed books...</p>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-[10px] shadow-1">
                <div className="w-full overflow-x-auto">
                  <div className="min-w-[1000px]">
                    {/* <!-- table header --> */}
                    <div className="flex items-center py-5.5 px-10 border-b border-gray-3">
                      <div className="min-w-[60px]">
                        <p className="text-dark font-medium">ID</p>
                      </div>
                      <div className="min-w-[200px]">
                        <p className="text-dark font-medium">Book Title</p>
                      </div>
                      <div className="min-w-[200px]">
                        <p className="text-dark font-medium">Member Name</p>
                      </div>
                      <div className="min-w-[150px]">
                        <p className="text-dark font-medium">Borrow Date</p>
                      </div>
                      <div className="min-w-[150px]">
                        <p className="text-dark font-medium">Return Date</p>
                      </div>
                      <div className="min-w-[150px]">
                        <p className="text-dark font-medium">Status</p>
                      </div>
                      <div className="min-w-[160px]">
                        <p className="text-dark font-medium text-right">Actions</p>
                      </div>
                    </div>

                    {/* <!-- borrowed books rows --> */}
                    {borrowedBooks.length > 0 ? (
                      borrowedBooks.map((borrowedBook) => {
                        const isReturned = borrowedBook.returnDate !== null;
                        return (
                          <div
                            key={borrowedBook.id}
                            onClick={() => handleRowClick(borrowedBook.id)}
                            className="flex items-center py-5.5 px-10 border-b border-gray-3 hover:bg-gray-1 transition cursor-pointer"
                          >
                            <div className="min-w-[60px]">
                              <p className="text-gray-600">{borrowedBook.id}</p>
                            </div>
                            <div className="min-w-[200px]">
                              <p className="text-dark font-medium">{borrowedBook.book.title.substring(0, 20) + "..."}</p>
                              <p className="text-xs text-gray-600">{borrowedBook.book.author.name}</p>
                            </div>
                            <div className="min-w-[200px]">
                              <p className="text-gray-600">{borrowedBook.member.name}</p>
                              <p className="text-xs text-gray-600">@{borrowedBook.member.username}</p>
                            </div>
                            <div className="min-w-[150px]">
                              <p className="text-gray-600">
                                {new Date(borrowedBook.borrowDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="min-w-[150px]">
                              <p className="text-gray-600">
                                {borrowedBook.returnDate
                                  ? new Date(borrowedBook.returnDate).toLocaleDateString()
                                  : "Not Returned"}
                              </p>
                            </div>
                            <div className="min-w-[150px]">
                              <span
                                className={`inline-flex py-1 px-3 rounded-full text-sm font-medium ${
                                  isReturned
                                    ? "text-green bg-green/10"
                                    : "text-orange bg-orange/10"
                                }`}
                              >
                                {isReturned ? "Returned" : "Active"}
                              </span>
                            </div>
                            <div className="min-w-[160px] flex justify-end gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRowClick(borrowedBook.id);
                                }}
                                className="text-blue hover:text-blue-dark transition text-sm"
                              >
                                View
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteBorrowedBook(borrowedBook.id, borrowedBook.book.title);
                                }}
                                className="text-red-500 hover:text-red-700 transition text-sm"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="flex items-center py-10 px-10 text-center justify-center">
                        <p className="text-gray-600">No borrowed books found</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* <!-- Pagination --> */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="bg-white shadow-1 rounded-md p-2">
                    <ul className="flex items-center gap-1">
                      {/* Previous Button */}
                      <li>
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="flex items-center justify-center w-8 h-9 ease-out duration-200 rounded-[3px] disabled:text-gray-4 disabled:cursor-not-allowed hover:text-white hover:bg-blue"
                        >
                          <svg
                            className="fill-current"
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M11.25 14.25L5.25 9L11.25 3.75" stroke="currentColor" strokeWidth="1.5" />
                          </svg>
                        </button>
                      </li>

                      {/* Page Numbers */}
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <li key={page}>
                          <button
                            onClick={() => handlePageChange(page)}
                            className={`flex items-center justify-center w-8 h-9 ease-out duration-200 rounded-[3px] ${
                              currentPage === page
                                ? "bg-blue text-white"
                                : "hover:text-white hover:bg-blue text-dark"
                            }`}
                          >
                            {page}
                          </button>
                        </li>
                      ))}

                      {/* Next Button */}
                      <li>
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="flex items-center justify-center w-8 h-9 ease-out duration-200 rounded-[3px] disabled:text-gray-4 disabled:cursor-not-allowed hover:text-white hover:bg-blue"
                        >
                          <svg
                            className="fill-current"
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M6.75 14.25L12.75 9L6.75 3.75" stroke="currentColor" strokeWidth="1.5" />
                          </svg>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default BorrowedBooksList;
