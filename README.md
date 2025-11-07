# ExecuDash

ExecuDash is an AI‑powered executive dashboard designed to provide real‑time insights into your business. This project is built with a modern, robust technology stack and serves as a solid foundation for a production-ready web application.

## Features

- **Modern Tech Stack:** Built with Next.js 14 (App Router), TypeScript, and Tailwind CSS.
- **Firebase Integration:** Uses Firebase for authentication (Email/Password and Google Sign-In), Firestore for the database, and Firebase Storage.
- **Component-Based UI:** Styled with the excellent [ShadCN UI](https://ui.shadcn.com/) library for a consistent, accessible, and customizable design system.
- **Authentication Flow:** Complete user authentication with a polished login page, protected routes, and a user profile dropdown.
- **Dynamic Dashboard:** A dashboard that fetches real-time data from Firestore, complete with skeleton loading states for an improved user experience.
- **Protected Routes:** A Higher-Order Component (`withAuth`) ensures that sensitive pages are only accessible to authenticated users.
- **CI/CD Ready:** Includes GitHub Actions workflows for automatically deploying the application to Firebase Hosting on pushes and pull requests to the `main` branch.

## Technology Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Backend & Database:** Firebase (Authentication, Firestore, Storage)
- **Styling:** Tailwind CSS
- **UI Components:** ShadCN UI

## Getting Started

To run ExecuDash locally:

1. Install dependencies:

   ```bash

