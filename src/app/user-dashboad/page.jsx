"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import OfficerNav from "@/components/OfficerNav";

export default function Dashboard() {
    const router = useRouter(), [time, setTime] = useState(null), [user_data, setUserData] = useState('');

    useEffect(() => {
        // Get user data from localStorage
        if (typeof window !== 'undefined') {
            const user_data = localStorage.getItem('user');
            if (user_data) {
                const parsedData = JSON.parse(user_data);
                setUserData(parsedData);
            }
        }
    },[])

    const handleLogout = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/logout`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            const { status, message } = await res.json();
            if (status !== "success") {
                alert(message || "Logout failed");
                return;
            }

            localStorage.clear();
            router.push('/');
        } catch (error) {
            console.error("Logout error:", error);
            alert("Something went wrong.");
        }
    };

    useEffect(()=>{
        const tellTime = () =>{
            let now = new Date();
            let hours = String(now.getHours()).padStart(2,'0');
            let minutes = String(now.getMinutes()).padStart(2,'0');
            let seconds = String(now.getSeconds()).padStart(2,'0');
            let currentTime = `${hours}:${minutes}:${seconds}`;
            setTime(currentTime);
        }

        setInterval(tellTime,100)
    },[])

    return (
        <main className="min-h-screen bg-slate-50">
            {/* HEADER */}
            <OfficerNav/>

            {/* MAIN SECTION */}
            <section className="py-5">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-lg font-semibold mb-6 text-gray-700">📌{user_data.fname} Your Quick Actions ({time})</h2>
                    <div className="grid sm:grid-cols-3 gap-6">

                        {/* Register Client */}
                        <button
                            onClick={() => router.push('/clients/new')}
                            className="bg-white p-6 py-11 rounded-lg shadow hover:shadow-lg text-left border-l-4 border-blue-600"
                        >
                            <h3 className="text-md font-semibold">🧾 Register New Client</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Capture details for a new client during a field visit.
                            </p>
                        </button>

                        {/* Record Loan */}
                        <button
                            onClick={() => router.push('/loans/new')}
                            className="bg-white p-6 py-10 rounded-lg shadow hover:shadow-lg text-left border-l-4 border-green-600"
                        >
                            <h3 className="text-md font-semibold">💰 Issue New Loan</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Record a new loan disbursement to a registered client.
                            </p>
                        </button>

                        <button
                            onClick={() => router.push('/loans/list')}
                            className="bg-white p-6 py-10 rounded-lg shadow hover:shadow-lg text-left border-l-4 border-green-600"
                        >
                            <h3 className="text-md font-semibold">💰 Issued Loans</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Record of loans disbursement to registered client.
                            </p>
                        </button>

                        {/* Record Repayment */}
                        <button
                            onClick={() => router.push('/repayments/new')}
                            className="bg-white p-6 py-10 rounded-lg shadow hover:shadow-lg text-left border-l-4 border-purple-600"
                        >
                            <h3 className="text-md font-semibold">💳 Record Repayment</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Log a repayment made by a client.
                            </p>
                        </button>

                        {/* View My Clients */}
                        <button
                            onClick={() => router.push('/clients/list')}
                            className="bg-white p-6 py-10 rounded-lg shadow hover:shadow-lg text-left border-l-4 border-yellow-500"
                        >
                            <h3 className="text-md font-semibold">📂 View Clients</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Browse through clients assigned to your field location.
                            </p>
                        </button>
                    </div>
                </div>
            </section>

        <Footer/>
        </main>
    );
}
