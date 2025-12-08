# Librarianz — Next.js App Router UI

Simple web for library management storefront-style UI built with Next.js App Router, TypeScript, and Tailwind CSS. Pages cover books, authors, members, and borrowed books with modal-driven create/edit flows. Built atop the NextMerce pre-built template: https://github.com/NextMerce/nextjs-ecommerce-template.

## 🚀 Tech Stack
- Next.js 16 (App Router) + TypeScript
- Tailwind CSS for styling
- Context providers for modal/preview state

## 🗂️ Project Structure
- `src/app/(site)` — App Router routes and layouts; root layout wraps Redux and modal providers
- `src/components` — feature components (Books, Authors, Members, BorrowedBooks, common UI)
- `src/context` — modal/preview context providers (add/edit dialogs, detail modals)
- `src/utils/api.ts` — API base URL configuration and endpoints
- `src/css` — global styles and font imports

## 📋 Requirements
- Node.js 18.18+ and npm

## 🛠️ Setup
```bash
npm install

# Environment (optional; defaults to http://localhost:8080)
setx NEXT_PUBLIC_API_BASE_URL "http://localhost:8080"
```

## 📜 Scripts
- `npm run dev` — start Next.js dev server
- `npm run build` — production build
- `npm start` — start built app
- `npm run lint` — run ESLint (Next.js config)

## 📚 Folder-by-Feature Highlights
- Books: list/grid items, detail edit modal, add book modal
- Authors: list and detail edit, add author modal
- Members: list and detail edit, add member modal
- Borrowed Books: list, detail edit, create borrowed book flow

## ✅ Linting & Quality
- Run `npm run lint` before committing to catch App Router and TypeScript issues

## 🚢 Deployment
1) Set `NEXT_PUBLIC_API_BASE_URL` to your backend base URL
2) `npm run build`
3) `npm start` on your host/platform
