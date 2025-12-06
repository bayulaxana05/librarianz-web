"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Breadcrumb from "../Common/Breadcrumb";
import { API_ENDPOINTS } from "@/utils/api";
import { useAddMemberModalContext } from "@/app/context/AddMemberModalContext";

interface Member {
  id: string;
  name: string;
  username: string;
  email: string;
  phoneNumber: string;
  address: string;
}

interface MembersResponse {
  content: Member[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
}

const Members = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  
  const router = useRouter();
  const searchParams = useSearchParams();

  const { openAddMemberModal } = useAddMemberModalContext();
  
  const currentPage = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("size") || "5");
  const queryParam = searchParams.get("search") || "";

  const fetchMembers = React.useCallback(async (page: number, search?: string) => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      params.set("page", page.toString());
      params.set("size", pageSize.toString());
      if (search) {
        params.set("search", search);
      }
      
      const response = await fetch(`${API_ENDPOINTS.MEMBERS}?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch members");
      }

      const data: MembersResponse = await response.json();
      setMembers(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching members:", err);
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  useEffect(() => {
    fetchMembers(currentPage, queryParam);
  }, [currentPage, pageSize, queryParam, fetchMembers]);

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

  if (error) {
    return (
      <>
        <Breadcrumb title={"Members"} pages={["Members"]} />
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
      <Breadcrumb title={"Members"} pages={["Members"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-wrap items-center justify-between gap-5 mb-7.5">
            <h2 className="font-medium text-dark text-2xl">All Members</h2>
            <button
              onClick={openAddMemberModal}
              className="text-blue hover:text-blue-dark transition"
            >
              Add New Member
            </button>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="mb-7.5">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Search members by name, email, or username..."
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
              <p>Loading members...</p>
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
                        <p className="text-dark font-medium">Name</p>
                      </div>
                      <div className="min-w-[200px]">
                        <p className="text-dark font-medium">Username</p>
                      </div>
                      <div className="min-w-[250px]">
                        <p className="text-dark font-medium">Email</p>
                      </div>
                      <div className="min-w-[150px]">
                        <p className="text-dark font-medium">Phone</p>
                      </div>
                      <div className="min-w-[120px]">
                        <p className="text-dark font-medium text-right">
                          Actions
                        </p>
                      </div>
                    </div>

                    {/* <!-- member rows --> */}
                    {members.length > 0 ? (
                      members.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center py-5.5 px-10 border-b border-gray-3 hover:bg-gray-1 transition"
                        >
                          <div className="min-w-[60px]">
                            <p className="text-gray-600">{member.id}</p>
                          </div>
                          <div className="min-w-[200px]">
                            <button
                              onClick={() => router.push(`/members/${member.id}`)}
                              className="text-dark font-medium hover:text-blue transition"
                            >
                              {member.name}
                            </button>
                          </div>
                          <div className="min-w-[200px]">
                            <p className="text-gray-600">@{member.username}</p>
                          </div>
                          <div className="min-w-[250px]">
                            <p className="text-gray-600 truncate">
                              {member.email}
                            </p>
                          </div>
                          <div className="min-w-[150px]">
                            <p className="text-gray-600">
                              {member.phoneNumber || "N/A"}
                            </p>
                          </div>
                          <div className="min-w-[120px] flex justify-end gap-2">
                            <button
                              onClick={() => router.push(`/members/${member.id}`)}
                              className="text-blue hover:text-blue-dark transition text-sm"
                            >
                              View
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center py-10 px-10 text-center justify-center">
                        <p className="text-gray-600">No members found</p>
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
                  {members.length > 0 && ` (${members.length} items)`}
                </p>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default Members;
