"use client";
import OfficerNav from "@/components/OfficerNav";
import Footer from "@/components/Footer";
import {FiArrowLeft, FiPlus} from "react-icons/fi";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ClientRepay() {
    const router = useRouter();
    const params = useParams();
    const client_id = params?.id;
    const [client, setClient] = useState(null);
    const [loans, setLoans] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const storageData = localStorage.getItem('user');
    const userDetails = JSON.parse(storageData);

    const [repaymentData, setRepaymentData] = useState({
        loan_id: "",
        amount: "",
        payment_date: new Date().toISOString().split('T')[0],
        officer_id: userDetails.user_id,
        principal: "",
        interest: ""
    });


    const [repaymentSuccess, setRepaymentSuccess] = useState(false);
    const [selectedLoanDetails, setSelectedLoanDetails] = useState(null);

    useEffect(() => {
        if (!client_id) return;

        const getSingleClient = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/get/client/${client_id}`);
                const data = await res.json();
                setClient(data.client);
                setLoans(data.loans);
            } catch (err) {
                console.error("❌ Failed to fetch client:", err);
                setError("❌ Failed to load client");
            } finally {
                setLoading(false);
            }
        };

        getSingleClient();
    }, [client_id, repaymentSuccess]);

    const handlePrint = () => {
        window.print();
    };

    const handleRepaymentChange = (e) => {
        const { name, value } = e.target;

        if (name === "loan_id") {
            const selectedLoan = loans.find(loan => loan.id.toString() === value);
            setSelectedLoanDetails(selectedLoan);

            if (selectedLoan) {
                const principal = parseFloat(selectedLoan.amount);
                const interestAmount = principal * 0.15;
                const totalRepayment = principal + interestAmount;

                setRepaymentData(prev => ({
                    ...prev,
                    loan_id: value,
                    amount: totalRepayment.toFixed(2),
                    principal: principal.toFixed(2),
                    interest: interestAmount.toFixed(2)
                }));
            }
        } else {
            setRepaymentData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };


    const handleRepaymentSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/repayments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...repaymentData,
                    officer_id: userDetails.user_id // Replace with actual officer ID from auth/session
                })
            });

            console.log(repaymentData);

            if (!response.ok) {
                throw new Error('Failed to record repayment');
            }

            // Update loan status to "repaid" if fully paid
            //await updateLoanStatus(repaymentData.loan_id);

            setRepaymentSuccess(true);
            setRepaymentData({
                loan_id: "",
                amount: "",
                payment_date: new Date().toISOString().split('T')[0],
                officer_id: userDetails.user_id,
            });
            setSelectedLoanDetails(null);

            setTimeout(() => setRepaymentSuccess(false), 3000);
        } catch (err) {
            console.error("❌ Repayment failed:", err);
            setError("❌ Failed to record repayment");
        }
    };

    // const updateLoanStatus = async (loanId) => {
    //     try {
    //         const response = await fetch(`http://localhost:8000/api/loans/${loanId}/status`, {
    //             method: 'PUT',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({
    //                 status: 'repaid'
    //             })
    //         });
    //
    //         if (!response.ok) {
    //             throw new Error('Failed to update loan status');
    //         }
    //     } catch (err) {
    //         console.error("❌ Failed to update loan status:", err);
    //     }
    // };

    return (
        <>
            <OfficerNav />
            <main className="container mx-auto px-4 py-8 max-w-4xl bg-white shadow rounded print:shadow-none">
                <div className="flex justify-between items-center mb-6 print:hidden">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                        <FiArrowLeft className="mr-2" />
                        Go Back
                    </button>
                    <button
                        onClick={handlePrint}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Print
                    </button>
                </div>

                <h2 className="text-2xl font-bold text-center mb-4">
                    Loan Repayment
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
                        </div>
                        {/* Repayment Form */}
                        { loans.some(item => item.status === "pending") ? (
                            <div className="border rounded-lg p-5 bg-gray-50 mb-8">
                                <h3 className="text-xl font-semibold mb-4">Record Repayment</h3>
                                {repaymentSuccess && (
                                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                                        Repayment recorded successfully!
                                    </div>
                                )}
                                <form onSubmit={handleRepaymentSubmit}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-gray-700 mb-2" htmlFor="loan_id">
                                                Select Loan
                                            </label>
                                            <select
                                                id="loan_id"
                                                name="loan_id"
                                                value={repaymentData.loan_id}
                                                onChange={handleRepaymentChange}
                                                className="w-full p-2 border rounded"
                                                required
                                            >
                                                <option value="">Select a loan</option>
                                                {loans
                                                    .filter(loan => loan.status === 'pending') // Changed from !== 'repaid' to === 'pending'
                                                    .map(loan => (
                                                        <option key={loan.id} value={loan.id}>
                                                            Loan #{loan.id} - ZMW {parseFloat(loan.amount).toFixed(2)} (Due: {loan.due_date})
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>

                                        {repaymentData.loan_id && selectedLoanDetails && (
                                            <div className="bg-blue-50 p-3 rounded col-span-1 md:col-span-2">
                                                <h4 className="font-medium mb-2">Loan Details</h4>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <label className="block text-gray-700 mb-1">Principal (ZMW)</label>
                                                        <input
                                                            type="number"
                                                            name="principal"
                                                            value={selectedLoanDetails.amount || ''}
                                                            readOnly
                                                            className="w-full p-2 border rounded bg-gray-100"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-gray-700 mb-1">Interest (ZMW)</label>
                                                        <input
                                                            type="number"
                                                            name="interest"
                                                            value={(selectedLoanDetails.amount * 0.15).toFixed(2) || ''} // Example 15% interest
                                                            readOnly
                                                            className="w-full p-2 border rounded bg-gray-100"
                                                        />
                                                    </div>

                                                    <p className="col-span-2 font-semibold">
                                                        <strong>Total Repayment:</strong> ZMW {(parseFloat(selectedLoanDetails.amount) * 1.15).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-gray-700 mb-2" htmlFor="amount">
                                                Repayment Amount (ZMW)
                                            </label>
                                            <input
                                                type="number"
                                                id="amount"
                                                name="amount"
                                                value={repaymentData.amount}
                                                onChange={handleRepaymentChange}
                                                className="w-full p-2 border rounded"
                                                step="0.01"
                                                min="0"
                                                max={selectedLoanDetails ? (selectedLoanDetails.amount * 1.15).toFixed(2) : undefined}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 mb-2" htmlFor="payment_date">
                                                Payment Date
                                            </label>
                                            <input
                                                type="date"
                                                id="payment_date"
                                                name="payment_date"
                                                value={repaymentData.payment_date}
                                                onChange={handleRepaymentChange}
                                                className="w-full p-2 border rounded"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                        disabled={!repaymentData.loan_id} // Disable if no loan selected
                                    >
                                        Record Repayment
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <div className="text-center p-6 border-2 border-dashed border-gray-200 rounded-lg">
                                <p className="text-gray-500 mb-4">No pending loans available</p>
                                <button
                                    onClick={() => router.push(`/loans/new/${client.id}`)}
                                    className="flex items-center justify-center mx-auto bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-sm transition-colors text-sm font-medium"
                                >
                                    <FiPlus className="mr-2" />
                                    Issue New Loan
                                </button>
                            </div>
                        )}

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
                                        <th className="p-2 border">Interest (15%)</th>
                                        <th className="p-2 border">Total Due (ZMW)</th>
                                        <th className="p-2 border">Term (Months)</th>
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
                                            <td className="p-2 border">ZMW {(parseFloat(loan.amount) * 0.15).toFixed(2)}</td>
                                            <td className="p-2 border font-semibold">ZMW {(parseFloat(loan.amount) * 1.15).toFixed(2)}</td>
                                            <td className="p-2 border">{loan.term}</td>
                                            <td className="p-2 border">{loan.due_date}</td>
                                            <td className={`p-2 border capitalize ${
                                                loan.status === 'repaid' ? 'text-green-600' :
                                                    loan.status === 'defaulted' ? 'text-red-600' :
                                                        'text-blue-600'
                                            }`}>
                                                {loan.status}
                                            </td>
                                            <td className="p-2 border">{new Date(loan.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </main>
            <Footer />
        </>
    );
}