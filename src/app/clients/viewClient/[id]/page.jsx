"use client";
import OfficerNav from "@/components/OfficerNav";
import Footer from "@/components/Footer";
import {FiArrowLeft, FiPlus} from "react-icons/fi";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ClientView() {
    const router = useRouter();
    const params = useParams();
    const client_id = params?.id;
    const [client, setClient] = useState(null);
    const [loans, setLoans] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!client_id) return;

        const getSingleClient = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/get/client/${client_id}`);
                const data = await res.json();
                setClient(data.client);
                setLoans(data.loans);
            } catch (err) {
                //console.error("❌ Failed to fetch client:", err);
                setError("❌ Failed to load client");
            } finally {
                setLoading(false);
            }
        };

        getSingleClient();
    }, [client_id]);

    const handlePrint = () => {
        window.print();
    };

    return (
            <main className="min-h-screen bg-slate-50">
                <OfficerNav />

                <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex justify-center items-center mb-6 gap-3 print:hidden">
                    <div className="mr-auto">
                        <button
                            onClick={() => router.back()}
                            className="flex  items-center text-blue-600 hover:text-blue-800"
                        >
                            <FiArrowLeft className="mr-2" />
                            Go Back
                        </button>
                    </div>
                    <button
                        onClick={handlePrint}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Print
                    </button>

                    {
                        loans.some(item => item.status === "pending") ? (
                            <button
                                onClick={() => router.push(`/repayments/repay/${client.id}`)}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            >
                                Repay Loan
                            </button>
                        ) : (
                            <button
                                onClick={() => router.push(`/loans/new/${client.id}`)}
                                className="flex items-center bg-green-600 hover:bg-green-700 text-white px-2 py-2 rounded-lg shadow-sm transition-colors"
                            >
                                <FiPlus className="mr-2" />
                                Issue Loan
                            </button>
                        )
                    }

                </div>

                <h2 className="text-2xl font-bold text-center mb-4">
                    Loan Client Profile
                </h2>

                {loading ? (
                    <p className="text-gray-500">Loading client data...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <>
                        {/* Client Info Card */}
                        <div className="border rounded-lg p-5 bg-gray-50 mb-8">
                            <p><strong>Full Name:</strong> {client?.name}</p>
                            <p><strong>NRC:</strong> {client?.nrc}</p>
                            <p><strong>Phone Number:</strong> {client?.phone}</p>
                            <p><strong>Business Activity:</strong> {client?.business}</p>
                            <p><strong>Location:</strong> {client?.location}</p>
                            <p><strong>Created At:</strong> {new Date(client?.created_at).toLocaleString()}</p>
                        </div>

                        {/* Loan Records */}
                        <h3 className="text-xl font-semibold mb-3">Loan Records</h3>
                        {loans.length === 0 ? (
                            <p className="text-gray-500">No loan records found.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full border border-gray-300 rounded-lg text-sm">
                                    <thead className="bg-blue-100 text-gray-700">
                                    <tr>
                                        <th className="p-2 border">Loan ID</th>
                                        <th className="p-2 border">Amount (ZMW)</th>
                                        <th className="p-2 border">Interest (%)</th>
                                        <th className="p-2 border">Term (Months)</th>
                                        <th className="p-2 border">Collateral</th>
                                        <th className="p-2 border">Due Date</th>
                                        <th className="p-2 border">Status</th>
                                        <th className="p-2 border">Created At</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {loans.map((loan) => (
                                        <tr key={loan.id} className="text-center border-b">
                                            <td className="p-2 border">{loan.id}</td>
                                            <td className="p-2 border">ZMW {parseFloat(loan.amount).toFixed(2)}</td>
                                            <td className="p-2 border">{loan.interest}%</td>
                                            <td className="p-2 border">{loan.term}</td>
                                            <td className="p-2 border">{loan.collateral}</td>
                                            <td className="p-2 border">{loan.due_date}</td>
                                            <td className="p-2 border capitalize">{loan.status}</td>
                                            <td className="p-2 border">{new Date(loan.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
                </div>
                <Footer />
            </main>

    );
}
