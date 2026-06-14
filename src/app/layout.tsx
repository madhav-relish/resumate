import type { Metadata } from "next";
import "./globals.css";
import { ResumeProvider } from "@/context/ResumeContext";

export const metadata: Metadata = {
  title: "Resumate - AI Resume & Portfolio Builder",
  description: "Create ATS-ready resumes and stunning portfolios in minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css" />
      </head>
      <body>
        <ResumeProvider>
          {children}
        </ResumeProvider>
      </body>
    </html>
  );
}
