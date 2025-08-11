"use client";


export default function Footer() {

    return (
        <>
            {/* FOOTER */}
            <footer className="text-center py-1 text-xs text-gray-500  mt-1">
                &copy; {new Date().getFullYear()} FundFlow
            </footer>
        </>
    );
}
