import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trello Replica - Kanban Board",
  description: "A Trello-like kanban board application for managing tasks and projects",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

