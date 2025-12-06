"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Breadcrumb from "../Common/Breadcrumb";
import { API_ENDPOINTS } from "@/utils/api";
import { useAddAuthorModalContext } from "@/app/context/AddAuthorModalContext";

interface Author {
  id: number;
  name: string;
  biography: string;
  website: string;
  birthDate: string;
}

interface AuthorsResponse {
  content: Author[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
}

const Authors = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const { openAddAuthorModal } = useAddAuthorModalContext();
  
  const currentPage = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("size") || "5");

  const fetchAuthors = React.useCallback(async (page: number) => {
    try {
      setLoading(true);
      
      const response = await fetch(
        `${API_ENDPOINTS.AUTHORS}?page=${page}&size=${pageSize}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch authors");
      }

      const data: AuthorsResponse = await response.json();
      setAuthors(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching authors:", err);
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  useEffect(() => {
    fetchAuthors(currentPage);
  }, [currentPage, pageSize, fetchAuthors]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", page.toString());
      router.push(`?${params.toString()}`);
    }
  };

  const handleDeleteAuthor = async (id: number, name: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`${API_ENDPOINTS.AUTHORS}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to delete author");
      }

      // Remove the deleted author from the list
      setAuthors((prevAuthors) =>
        prevAuthors.filter((author) => author.id !== id)
      );

      alert("Author deleted successfully");
    } catch (err) {
      console.error("Error deleting author:", err);
      alert(
        `Failed to delete author: ${err instanceof Error ? err.message : "An error occurred"}`
      );
    }
  };

  if (error) {
    return (
      <>
        <Breadcrumb title={"Authors"} pages={["Authors"]} />
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
      <Breadcrumb title={"Authors"} pages={["Authors"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-wrap items-center justify-between gap-5 mb-7.5">
            <h2 className="font-medium text-dark text-2xl">All Authors</h2>
            <button
              onClick={openAddAuthorModal}
              className="text-blue hover:text-blue-dark transition"
            >
              Add New Author
            </button>
          </div>

          {loading ? (
            <div className="text-center py-10">
              <p>Loading authors...</p>
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
                      <div className="min-w-[250px]">
                        <p className="text-dark font-medium">Name</p>
                      </div>
                      <div className="min-w-[250px]">
                        <p className="text-dark font-medium">Biography</p>
                      </div>
                      <div className="min-w-[150px]">
                        <p className="text-dark font-medium">Birth Date</p>
                      </div>
                      <div className="min-w-[150px]">
                        <p className="text-dark font-medium">Website</p>
                      </div>
                      <div className="min-w-[120px]">
                        <p className="text-dark font-medium text-right">
                          Actions
                        </p>
                      </div>
                    </div>

                    {/* <!-- author rows --> */}
                    {authors.length > 0 ? (
                      authors.map((author) => (
                        <div
                          key={author.id}
                          className="flex items-center py-5.5 px-10 border-b border-gray-3 hover:bg-gray-1 transition"
                        >
                          <div className="min-w-[60px]">
                            <p className="text-gray-600">{author.id}</p>
                          </div>
                          <div className="min-w-[250px]">
                            <button onClick={() => router.push(`/authors/${author.id}`)}className="text-dark hover:text-blue font-medium">{author.name}</button>
                          </div>
                          <div className="min-w-[250px]">
                            <p className="text-gray-600 truncate">
                              {author.biography
                                ? author.biography.substring(0, 20) + "..."
                                : "N/A"}
                            </p>
                          </div>
                          <div className="min-w-[150px]">
                            <p className="text-gray-600">
                              {author.birthDate || "N/A"}
                            </p>
                          </div>
                          <div className="min-w-[150px]">
                            <a
                              href={author.website || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue hover:underline"
                            >
                              {author.website ? "Link" : "N/A"}
                            </a>
                          </div>
                          <div className="min-w-[120px] flex justify-end gap-2">
                            <button
                              onClick={() => router.push(`/authors/${author.id}`)}
                              className="text-blue hover:text-blue-dark transition text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteAuthor(author.id, author.name)
                              }
                              className="text-red-500 hover:text-red-700 transition text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center py-10 px-10 text-center justify-center">
                        <p className="text-gray-600">No authors found</p>
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
                            <path
                              d="M12.1782 16.1156C12.0095 16.1156 11.8407 16.0594 11.7282 15.9187L5.37197 9.45C5.11885 9.19687 5.11885 8.80312 5.37197 8.55L11.7282 2.08125C11.9813 1.82812 12.3751 1.82812 12.6282 2.08125C12.8813 2.33437 12.8813 2.72812 12.6282 2.98125L6.72197 9L12.6563 15.0187C12.9095 15.2719 12.9095 15.6656 12.6563 15.9187C12.4876 16.0312 12.347 16.1156 12.1782 16.1156Z"
                              fill=""
                            />
                          </svg>
                        </button>
                      </li>
                      {/* Previous Button-end */}

                      {/* Page Numbers */}
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <li key={page}>
                            <button
                              onClick={() => handlePageChange(page)}
                              className={`flex py-1.5 px-3.5 duration-200 rounded-[3px] ${
                                currentPage === page
                                  ? "bg-blue text-white"
                                  : "hover:text-white hover:bg-blue"
                              }`}
                            >
                              {page}
                            </button>
                          </li>
                        )
                      )}
                      {/* Page Numbers -end */}

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
                            <path
                              d="M5.82197 16.1156C5.65322 16.1156 5.5126 16.0594 5.37197 15.9469C5.11885 15.6937 5.11885 15.3 5.37197 15.0469L11.2782 9L5.37197 2.98125C5.11885 2.72812 5.11885 2.33437 5.37197 2.08125C5.6251 1.82812 6.01885 1.82812 6.27197 2.08125L12.6282 8.55C12.8813 8.80312 12.8813 9.19687 12.6282 9.45L6.27197 15.9187C6.15947 16.0312 5.99072 16.1156 5.82197 16.1156Z"
                              fill=""
                            />
                          </svg>
                        </button>
                      </li>
                      {/* Next Button-end */}

                    </ul>
                  </div>
                </div>
              )}

              {/* Info text */}
              <div className="mt-4 text-center text-gray-600">
                <p>
                  Showing page {currentPage} of {totalPages}
                  {authors.length > 0 && ` (${authors.length} items)`}
                </p>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default Authors;