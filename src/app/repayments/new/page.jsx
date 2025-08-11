'use client';

import { useEffect, useState } from 'react';
import OfficerNav from "@/components/OfficerNav";
import Footer from "@/components/Footer";
import {ArrowLeft} from "lucide-react";
import { useRouter } from 'next/navigation';
import Link from "next/link";

export default function LoanRepayment() {
    const [loans, setLoans] = useState([]);
    const [filteredLoans, setFilteredLoans] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();
    const [user, setUser ]= useState('');

    useEffect(() => {
        // Get user data from localStorage
        if (typeof window !== 'undefined') {
            const user_data = localStorage.getItem('user');
            if (user_data) {
                const parsedData = JSON.parse(user_data);
                setUser(parsedData);
            }
        }
    },[])

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/loans/${user.user_id}`)
            .then(res => res.json())
            .then(data => {
                const cleanData = data || [];
                setLoans(cleanData);
                setFilteredLoans(cleanData);
            })
            .catch(err => {
                console.error('❌ Failed to fetch loans:', err);
                setError('❌ Failed to load loans');
            })
            .finally(() => setLoading(false));
    }, []);

    // Handle search
    useEffect(() => {
        const term = search.toLowerCase();
        const results = loans.filter(
            loan =>
                loan.client_name.toLowerCase().includes(term) ||
                loan.status.toLowerCase().includes(term)
        );
        setFilteredLoans(results);
    }, [search, loans]);

    // Export CSV
    const exportToCSV = () => {
        const headers = ['#', 'Client ID', 'Client Name', 'Amount (ZMW)', 'Interest (%)', 'Term', 'Due Date', 'Status', 'Serviced By', 'Created At'];
        const rows = filteredLoans.map((loan, index) => [
            index + 1,
            loan.client_id,
            loan.client_name,
            parseFloat(loan.amount).toFixed(2),
            loan.interest,
            loan.term,
            loan.due_date,
            loan.status,
            loan.fname+" "+loan.lname,
            loan.created_at,
        ]);

        const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'loans_export.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <main className="min-h-screen bg-slate-50 ">
            <OfficerNav/>
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h2 className='text-black font-bold uppercase py-4'>Loan Repayments</h2>
                <div className="mx-auto flex flex-col md:flex-row justify-between items-center mb-4 gap-3 ">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-2"
                    >
                        <ArrowLeft className="mr-2" />
                        Go Back
                    </button>
                    <input
                        type="text"
                        placeholder="🔍 Search by name or status..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 w-full md:w-1/3 focus:outline-none focus:ring focus:border-blue-300"
                    />

                    {
                        user.user_role === "admin" ? (
                            <div className="flex gap-2">
                                <button
                                    onClick={exportToCSV}
                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                                >
                                    ⬇ Export CSV
                                </button>
                                <button
                                    onClick={() => window.print()}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                                >
                                    🖨 Print
                                </button>
                            </div>
                        ) : (
                            <div></div>
                        )
                    }
                </div>

                <div className="w-full mx-auto p-5 overflow-x-auto">
                    {loading ? (
                        <p className="text-gray-500">Loading loans...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : filteredLoans.length === 0 ? (
                        <p className="text-gray-500">No loans found.</p>
                    ) : (
                        <table className="min-w-full text-sm text-left text-gray-700">
                            <thead className="bg-gray-100 border-b border-gray-300 text-xs uppercase font-medium">
                            <tr>
                                <th className="px-1 py-3">#</th>
                                <th className="px-1 py-3">Client ID</th>
                                <th className="px-1 py-3">Client name</th>
                                <th className="px-1 py-3">Amount (ZMW)</th>
                                <th className="px-1 py-3">Interest (%)</th>
                                <th className="px-1 py-3">Term (Months)</th>
                                <th className="px-1 py-3">Collateral</th>
                                <th className="px-1 py-3">Due Date</th>
                                <th className="px-1 py-3">Status</th>
                                {
                                    user.user_role === 'admin' &&(
                                        <th className="px-1 py-3">Service By</th>
                                    )
                                }
                                <th className="px-1 py-3">Created At</th>
                                <th className="px-1 py-3">Options</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            {filteredLoans.map((loan, index) => (
                                <tr key={`${loan.id} - ${index}`} className="hover:bg-blue-50 transition">
                                    <td className="px-4 py-2">{index + 1}</td>
                                    <td className="px-4 py-2">{loan.client_id}</td>
                                    <td className="px-4 py-2">{loan.client_name}</td>
                                    <td className="px-4 py-2">ZMW {parseFloat(loan.amount).toFixed(2)}</td>
                                    <td className="px-4 py-2">{loan.interest}%</td>
                                    <td className="px-4 py-2">{loan.term}</td>
                                    <td className="px-4 py-2">{loan.collateral}</td>
                                    <td className="px-4 py-2">{loan.due_date}</td>
                                    <td className={`px-4 py-2 font-semibold ${loan.status === 'pending' ? 'text-red-500' : 'text-green-600'}`}>
                                        {loan.status}
                                    </td>
                                    {
                                        user.user_role === 'admin' && (
                                            <td className="px-4 py-2">{loan.fname+" "+loan.lname}</td>
                                        )
                                    }
                                    <td className="px-4 py-2">{new Date(loan.created_at).toLocaleDateString()}</td>
                                    <td className="px-4 py-2">
                                        <Link
                                            href={`/clients/viewClient/${loan.client_id}`}
                                            className="bg-blue-600 text-white hover:bg-green-700 px-3 py-2 my-2 rounded"
                                        >
                                            View
                                        </Link>

                                        {loan.status === 'repaid' ? (
                                            <Link
                                                href={`/repayments/repay/${loan.client_id}`}
                                                className="bg-green-600 text-white hover:bg-blue-700 px-3 mx-2 py-2 my-2 rounded"
                                            >
                                                Profile
                                            </Link>
                                        ) : (
                                            <Link
                                                href={`/repayments/repay/${loan.client_id}`}
                                                className="bg-green-600 text-white hover:bg-blue-700 px-3 mx-2 py-2 my-2 rounded"
                                            >
                                                Repay
                                            </Link>
                                        )}

                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
            <Footer/>
        </main>
    );
}
