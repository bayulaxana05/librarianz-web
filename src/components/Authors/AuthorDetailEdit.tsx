"use client";
import React, { useEffect, useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/utils/api";

interface AuthorDetail {
  id: number;
  name: string;
  biography?: string;
  website?: string;
  birthDate?: string;
}

const AuthorDetailEdit = ({ id }: { id: string }) => {
  const [author, setAuthor] = useState<AuthorDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const router = useRouter();

  // form state
  const [name, setName] = useState("");
  const [biography, setBiography] = useState("");
  const [website, setWebsite] = useState("");
  const [birthDate, setBirthDate] = useState("");

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        setLoading(true);
        const resp = await fetch(`${API_BASE_URL}/api/authors/${id}`);
        if (!resp.ok) throw new Error("Failed to fetch author");
        const data: AuthorDetail = await resp.json();
        setAuthor(data);
        setName(data.name || "");
        setBiography(data.biography || "");
        setWebsite(data.website || "");
        setBirthDate(data.birthDate || "");
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchAuthor();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const payload = {
        name,
        biography,
        website,
        birthDate,
      };

      const resp = await fetch(`${API_BASE_URL}/api/authors/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text || "Failed to update author");
      }

      const updated: AuthorDetail = await resp.json();
      setAuthor(updated);
      setSuccessMessage("Author updated successfully.");
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Breadcrumb title={author ? author.name : "Author"} pages={["authors", "detail"]} />

      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-col xl:flex-row gap-7.5">
            <div className="xl:max-w-[370px] w-full bg-white rounded-xl shadow-1">
              <div className="py-5 px-4 sm:px-7.5 border-b border-gray-3">
                <p className="font-medium text-xl text-dark">Author Detail</p>
              </div>

              <div className="p-4 sm:p-7.5">
                {loading ? (
                  <p>Loading author...</p>
                ) : error ? (
                  <p className="text-red-500">Error: {error}</p>
                ) : author ? (
                  <div className="flex flex-col gap-4">
                    <p className="text-gray-600">
                      <strong>Name:</strong> {author.name || "-"}
                    </p>
                    <p><strong>Bio:</strong></p>
                    <p className="text-gray-600">{author.biography || "-"}</p>

                    <p className="text-gray-600">
                      <strong>Birth Date:</strong> {author.birthDate || "-"}
                    </p>

                    <p>
                      <a
                        href={author.website || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue hover:underline"
                      >
                        {author.website || "Website"}
                      </a>
                    </p>

                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => router.push("/authors")}
                        className="inline-flex font-medium text-white bg-gray-600 py-2 px-4 rounded-md"
                      >
                        Back
                      </button>
                    </div>
                  </div>
                ) : (
                  <p>No author found.</p>
                )}
              </div>
            </div>

            <div className="xl:max-w-[770px] w-full bg-white rounded-xl shadow-1 p-4 sm:p-7.5 xl:p-10">
              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label htmlFor="name" className="block mb-2.5">
                    Name <span className="text-red">*</span>
                  </label>
                  <input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    required
                    className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>

                <div className="mb-5">
                  <label htmlFor="biography" className="block mb-2.5">
                    Biography
                  </label>
                  <textarea
                    id="biography"
                    rows={6}
                    value={biography}
                    onChange={(e) => setBiography(e.target.value)}
                    className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full p-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>

                <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
                  <div className="w-full">
                    <label htmlFor="website" className="block mb-2.5">
                      Website
                    </label>
                    <input
                      id="website"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      type="text"
                      placeholder="https://example.com"
                      className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    />
                  </div>

                  <div className="w-full">
                    <label htmlFor="birthDate" className="block mb-2.5">
                      Birth Date
                    </label>
                    <input
                      id="birthDate"
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    />
                  </div>
                </div>

                {error && <p className="text-red-500 mb-3">{error}</p>}
                {successMessage && (
                  <p className="text-green-600 mb-3">{successMessage}</p>
                )}

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
                      // reset to fetched values
                      if (author) {
                        setName(author.name || "");
                        setBiography(author.biography || "");
                        setWebsite(author.website || "");
                        setBirthDate(author.birthDate || "");
                        setSuccessMessage(null);
                        setError(null);
                      }
                    }}
                    className="inline-flex font-medium text-dark bg-gray-1 py-3 px-5 rounded-md"
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

export default AuthorDetailEdit;
