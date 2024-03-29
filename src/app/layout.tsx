import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GlobalProvider } from "../hooks/context";
import { ToastContainer } from "react-toastify";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SAATHI",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} `}>
        <UserProvider>
          <GlobalProvider>{children}</GlobalProvider>
        </UserProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
