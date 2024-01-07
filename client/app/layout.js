import "./globals.css";
import { cn } from "~/lib/utils";
import { body, heading } from "../lib/fonts";

export const metadata = {
  title: "Skipe",
  description:
    "A simple connection application for local businesses and clients",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={cn(body.variable, heading.variable, "font-sans")}>
        {children}
      </body>
    </html>
  );
}
