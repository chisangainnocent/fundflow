'use client';

import {useEffect, useState} from "react";
import OfficerNav from "@/components/OfficerNav";
import Footer from "@/components/Footer";

export default function Summary() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchSummary() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/summary`);
                if (!res.ok) throw new Error("Failed to fetch summary data");
                const json = await res.json();
                setData(json);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchSummary();
    }, []);

    if (loading) return (
        <main className="min-h-screen bg-slate-50 flex items-center justify-center">
            <p className="text-gray-500 text-lg">Loading summary...</p>
        </main>
    );

    if (error) return (
        <main className="min-h-screen bg-slate-50 flex items-center justify-center">
            <p className="text-red-500 text-lg">Error: {error}</p>
        </main>
    );

    // Helper function to format numbers as currency
    const formatCurrency = (num) => {
        return Number(num).toLocaleString('en-ZM', { style: 'currency', currency: 'ZMW' });
    };

    const caculateSalary = (percent,profit) => {
        if (profit >= 2500){
            const remove_50 = profit * 0.3;
            return (remove_50 * percent) / 100;
        }else{
            return (500 * percent) / 100;
        }
    }

    return (
        <main className="min-h-screen bg-slate-50">
            <OfficerNav />

            <div className="max-w-5xl mx-auto px-6 py-10">
                <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Business Summary</h1>

                {/* Profit, Spent, Gross */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white rounded shadow p-6 text-center">
                        <h2 className="text-xl font-semibold mb-2">Profit</h2>
                        <p className="text-2xl font-bold text-green-600">
                            {formatCurrency(data.all_profit[0]?.profit || 0)}
                        </p>
                    </div>
                    <div className="bg-white rounded shadow p-6 text-center">
                        <h2 className="text-xl font-semibold mb-2">Spent</h2>
                        <p className="text-2xl font-bold text-red-600">
                            {formatCurrency(data.all_spent[0]?.spent || 0)}
                        </p>
                    </div>
                    <div className="bg-white rounded shadow p-6 text-center">
                        <h2 className="text-xl font-semibold mb-2">Gross Turnover</h2>
                        <p className="text-2xl font-bold text-blue-600">
                            {formatCurrency(data.all_gross[0]?.gross || 0)}
                        </p>
                    </div>
                </section>

                {/* Tax info */}
                <section className="bg-white rounded shadow p-6 mb-10">
                    <h2 className="text-2xl font-semibold mb-4">Tax Information</h2>
                    <div className="flex flex-col md:flex-row md:space-x-8">
                        <div>
                            <p className="text-gray-600">Month: <span className="font-medium">{data.tax[0]?.tax_month || "-"}</span></p>
                            <p className="text-gray-600">Total Turnover: <span className="font-medium">{formatCurrency(data.tax[0]?.total_turnover || 0)}</span></p>
                            <p className="text-gray-600">Turnover Tax (4%): <span className="font-medium">{formatCurrency(data.tax[0]?.turnover_tax || 0)}</span></p>
                        </div>
                    </div>
                </section>

                {/* Loans Summary */}
                <section className="bg-white rounded shadow p-6 mb-10">
                    <h2 className="text-2xl font-semibold mb-4">Loans Overview</h2>
                    <div className="flex flex-wrap gap-6 text-gray-700">
                        <div className="flex-1 min-w-[150px]">
                            <p className="font-semibold">Total Loans Disbursed</p>
                            <p>{data.all_loans[0]?.all_loans || 0}</p>
                        </div>
                        <div className="flex-1 min-w-[150px]">
                            <p className="font-semibold">Fully Paid Loans</p>
                            <p>{data.paid_loans[0]?.paid_loans || 0}</p>
                        </div>
                        <div className="flex-1 min-w-[150px]">
                            <p className="font-semibold">Outstanding Loans</p>
                            <p>{data.not_paid_loans[0]?.not_paid_loans || 0}</p>
                        </div>
                    </div>
                </section>

                {/* Employees & Salaries */}
                <section className="bg-white rounded shadow p-6 mb-10">
                    <h2 className="text-2xl font-semibold mb-6">Employees Performance & Salaries</h2>

                    <table className="w-full border-collapse text-left">
                        <thead>
                        <tr>
                            <th className="border-b py-2 px-3">Officer</th>
                            <th className="border-b py-2 px-3">Disbursed (ZMW)</th>
                            <th className="border-b py-2 px-3">Repaid (ZMW)</th>
                            <th className="border-b py-2 px-3">Performance Score</th>
                            <th className="border-b py-2 px-3">Performance %</th>
                            <th className="border-b py-2 px-3">Salary (ZMW)</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.employees.map(emp => (
                            <tr key={emp.user_id} className="hover:bg-slate-100">
                                <td className="py-2 px-3">{emp.officer_name}</td>
                                <td className="py-2 px-3">{formatCurrency(emp.total_principal_disbursed)}</td>
                                <td className="py-2 px-3">{formatCurrency(emp.total_principal_repaid)}</td>
                                <td className="py-2 px-3">{Number(emp.performance_score).toFixed(2)}</td>
                                <td className="py-2 px-3">{(Number(emp.performance_pct) * 100).toFixed(2)}%</td>
                                <td className="py-2 px-3">{formatCurrency(caculateSalary((Number(emp.performance_pct) * 100).toFixed(2), data.all_profit[0]?.profit))}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </section>
            </div>

            <Footer />
        </main>
    );
}
