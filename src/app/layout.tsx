import type { Metadata } from "next";
import "../../styles.css";

export const metadata: Metadata = {
  title: "Poetry Prompt",
  description: "A daily writing-prompt app with a private writing space and a public feed.",
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
