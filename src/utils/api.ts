/**
 * API Configuration
 * Uses environment variable NEXT_PUBLIC_API_BASE_URL
 * Must be prefixed with NEXT_PUBLIC_ to be accessible in browser
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export const API_ENDPOINTS = {
  AUTHORS: `${API_BASE_URL}/api/authors`,
  BOOKS: `${API_BASE_URL}/api/books`,
  MEMBERS: `${API_BASE_URL}/api/members`,
  BORROWED_BOOKS: `${API_BASE_URL}/api/borrowed-books`,
};
