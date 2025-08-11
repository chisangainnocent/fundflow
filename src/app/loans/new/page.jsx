'use client';
import { useState, useEffect } from 'react';
import {
    DollarSign, Percent, Calendar, Clock,
    User, Smartphone, CreditCard, ArrowLeft,Newspaper
} from 'lucide-react';
import OfficerNav from "@/components/OfficerNav";
import { useRouter } from 'next/navigation';

export default function IssueLoanForm() {
    const [clients, setClients] = useState([]);
    const router = useRouter();
    const [createdBy, setCreatedBy] = useState(null);
    const [user, setUser] = useState('');

    useEffect(() => {
        // Get user data from localStorage
        if (typeof window !== 'undefined') {
            const user_data = localStorage.getItem('user');
            if (user_data) {
                const parsedData = JSON.parse(user_data);
                setUser(parsedData);
                setCreatedBy(parsedData.user_id);
            }
        }
    },[])

    const [form, setForm] = useState({
        client_id: '',
        amount: '',
        interest: 15,
        term: 1,
        collateral: '',
        start_date: new Date().toISOString().split('T')[0], // Default to today
        method: 'cash',
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const [calculations, setCalculations] = useState({
        totalDue: 0,
        monthlyRepayment: 0,
        dueDate: ''
    });


    useEffect(() => {
        // Fetch clients - using mock data for demo
        // const mockClients = [
        //     { id: 1, name: 'John Doe', nrc: '123456/78/1' },
        //     { id: 2, name: 'Jane Smith', nrc: '987654/32/1' },
        //     { id: 3, name: 'Mike Johnson', nrc: '456789/12/1' }
        // ];
        // setClients(mockClients);

        // Uncomment below for real API call:+30
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/clients/${user.user_id}`)
            .then(res => res.json())
            .then(data => {
                console.log('Clients data:', data);
                setClients(data.data || []);
            })
            .catch(error => {
                console.error('Error fetching clients:', error);
                setMessage('❌ Failed to load clients');
            });

    }, []);

    useEffect(() => {
        if (!form.amount || !form.term || !form.interest || !form.start_date) return;

        const principal = parseFloat(form.amount);
        const interestAmount = (principal * parseFloat(form.interest)) / 100;
        const total = principal + interestAmount;
        const monthly = total / parseFloat(form.term);

        // Calculate due date - fix the date mutation bug
        const startDate = new Date(form.start_date);
        const dueDate = new Date(startDate);
        dueDate.setMonth(dueDate.getMonth() + parseInt(form.term));

        setCalculations({
            totalDue: total.toFixed(2),
            monthlyRepayment: monthly.toFixed(2),
            dueDate: dueDate.toISOString().split('T')[0]
        });
    }, [form.amount, form.term, form.interest, form.start_date]);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        setMessage('');

        // Enhanced validation
        if (!form.client_id) {
            setMessage('❌ Please select a client');
            return;
        }

        if (!form.amount || parseFloat(form.amount) <= 0) {
            setMessage('❌ Please enter a valid loan amount');
            return;
        }

        if (!form.term || parseInt(form.term) <= 0) {
            setMessage('❌ Please enter a valid term');
            return;
        }

        if (!form.collateral) {
            setMessage('❌ Please enter the collateral');
            return;
        }

        if (!form.start_date) {
            setMessage('❌ Please select a start date');
            return;
        }

        if (!createdBy) {
            setMessage('❌ Unable to identify loan officer. Please log in again.');
            return;
        }

        setLoading(true);

        try {
            const payload = {
                client_id: parseInt(form.client_id),
                amount: parseFloat(form.amount),
                interest: parseFloat(form.interest),
                term: parseInt(form.term),
                collateral: form.collateral,
                start_date: form.start_date,
                created_by: parseInt(createdBy)
            };

            console.log('Sending payload:', payload);

            // Mock API response for demo
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Simulate success
            const mockResponse = {
                status: 'success',
                loan_id: Math.floor(Math.random() * 1000),
                message: 'Loan issued successfully'
            };

            console.log('Mock response:', mockResponse);
            setMessage('✅ Loan issued successfully!');

            // Reset form
            setTimeout(() => {
                setForm({
                    client_id: '',
                    amount: '',
                    interest: 15,
                    term: 1,
                    collateral: '',
                    start_date: new Date().toISOString().split('T')[0],
                    method: 'cash',
                });
                setMessage('');
            }, 3000);


            // Uncomment for real API call:
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/issue/loans`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload),
            });

            const result = await res.json();
            console.log('API Response:', result);

            if (!res.ok) {
                throw new Error(result.message || `HTTP ${res.status}: Failed to issue loan`);
            }

            setMessage('✅ Loan issued successfully!');
            setTimeout(() => {
                // router.push('/loans');
                window.location.href = '/loans/list';
            }, 1500);


        } catch (error) {
            console.error('Submission error:', error);
            setMessage(`❌ ${error.message || 'An error occurred. Please try again.'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-50">
            <OfficerNav />
        <div className="">

            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="mb-6">
                    {message && (
                        <div className={`p-4 rounded-lg mb-4 ${
                            message.includes('✅') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
                        }`}>
                            <p className="font-medium">{message}</p>
                        </div>
                    )}

                    <button
                        onClick={() => router.back()}
                        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-4"
                    >
                        <ArrowLeft className="mr-2" />
                        Go Back
                    </button>

                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                        Issue New Loan
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Fill in the details below to issue a loan to a client
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-1 bg-gradient-to-r from-blue-50 to-gray-50 border-b border-gray-200">
                        <h2 className="px-5 py-3 font-semibold text-gray-700">
                            Loan Details
                        </h2>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="space-y-4">
                            {/* Client Selection */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Select Client *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="text-gray-400" />
                                    </div>
                                    <select
                                        name="client_id"
                                        className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={form.client_id}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">-- Choose Client --</option>
                                        {clients.map(c => (
                                            <option key={c.id} value={c.id}>
                                                {c.name} ({c.nrc})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Loan Amount */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Loan Amount (ZMW) *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <DollarSign className="text-gray-400" />
                                    </div>
                                    <input
                                        type="number"
                                        name="amount"
                                        className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={form.amount}
                                        onChange={handleChange}
                                        required
                                        min="1"
                                        step="0.01"
                                        placeholder="5000"
                                    />
                                </div>
                            </div>

                            {/* Interest Rate */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Interest Rate (%)
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Percent className="text-gray-400" />
                                    </div>
                                    <input
                                        type="number"
                                        name="interest"
                                        className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={form.interest}
                                        onChange={handleChange}
                                        min="0"
                                        max="100"
                                        step="0.1"
                                        placeholder="15"
                                    />
                                </div>
                            </div>

                            {/* Term Months */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Repayment Term (Months) *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Clock className="text-gray-400" />
                                    </div>
                                    <input
                                        type="number"
                                        name="term"
                                        className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={form.term}
                                        onChange={handleChange}
                                        required
                                        min="1"
                                        placeholder="1"
                                    />
                                </div>
                            </div>

                            {/* Start Date */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Start Date *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Calendar className="text-gray-400" />
                                    </div>
                                    <input
                                        type="date"
                                        name="start_date"
                                        className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={form.start_date}
                                        onChange={handleChange}
                                        required
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                            </div>

                            {/* collateral */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Collateral *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Newspaper className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="collateral"
                                        className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={form.collateral}
                                        onChange={handleChange}
                                        required
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                            </div>

                            {/* Disbursement Method */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Disbursement Method
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Smartphone className="text-gray-400" />
                                    </div>
                                    <select
                                        name="method"
                                        className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={form.method}
                                        onChange={handleChange}
                                    >
                                        <option value="cash">Cash</option>
                                        <option value="mobile_money">Mobile Money</option>
                                        <option value="bank_transfer">Bank Transfer</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Calculation Summary */}
                        {form.amount && (
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                <h3 className="font-medium text-blue-800 mb-3">Loan Summary</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Principal Amount</p>
                                        <p className="font-semibold text-lg">
                                            ZMW {parseFloat(form.amount || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Interest ({form.interest}%)</p>
                                        <p className="font-semibold text-lg">
                                            ZMW {(parseFloat(form.amount || 0) * parseFloat(form.interest) / 100).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Total Repayment</p>
                                        <p className="font-semibold text-lg text-blue-800">
                                            ZMW {parseFloat(calculations.totalDue || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Monthly Payment</p>
                                        <p className="font-semibold text-lg text-blue-800">
                                            ZMW {parseFloat(calculations.monthlyRepayment || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                        </p>
                                    </div>
                                    {calculations.dueDate && (
                                        <div className="col-span-2">
                                            <p className="text-sm text-gray-600">Final Due Date</p>
                                            <p className="font-semibold text-lg">
                                                {new Date(calculations.dueDate).toLocaleDateString('en-GB')}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Debug Info */}
                        {/*{createdBy && (*/}
                        {/*    <div className="text-xs text-gray-500">*/}
                        {/*        Loan Officer ID: {createdBy}*/}
                        {/*    </div>*/}
                        {/*)}*/}

                        {/* Submit Button */}
                        <div className="flex justify-end pt-4">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg shadow-sm transition-colors w-full sm:w-auto"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="mr-2" />
                                        Issue Loan
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </main>
    );
}