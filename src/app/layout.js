import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Head from "next/head";
import { Suspense } from "react";
import Link from "next/link";
import Loading from "@/components/Loading"; // You'll create this component

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: {
        template: '%s | FundFlow',
        default: 'FundFlow - Loan Management System',
    },
    description: "Modern loan management and tracking system",
    icons: {
        icon: '/favicon.ico',
        apple: '/apple-touch-icon.png',
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <Head>
            <Link rel="icon" href="/favicon.ico" sizes="any" />
            <Link rel="manifest" href="/manifest.json" />
            <Link
                rel="icon"
                href="/icon?<generated>"
                type="image/<generated>"
                sizes="<generated>"
            />
            <Link
                rel="apple-touch-icon"
                href="/apple-icon?<generated>"
                type="image/<generated>"
                sizes="<generated>"
            />
        </Head>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Suspense fallback={<Loading />}>
            {children}
        </Suspense>
        </body>
        </html>
    );
}