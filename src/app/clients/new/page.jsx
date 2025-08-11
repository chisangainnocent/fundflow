'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import OfficerNav from '@/components/OfficerNav';
import { FiArrowLeft, FiUser, FiPhone, FiBriefcase, FiMapPin } from 'react-icons/fi';
import { FaIdCard } from 'react-icons/fa';
import Footer from "@/components/Footer";

export default function NewClientPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: '',
        nrc: '',
        phone: '',
        business: '',
        location: '',
    });
    const [createdBy, setCreatedBy] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const user_data = JSON.parse(localStorage.getItem('user') || '{}');
            if (!user_data?.user_id) {
                alert('You must be logged in.');
                router.push('/');
            } else {
                setCreatedBy(user_data.user_id);
            }
        }
    }, [router]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!createdBy) return;

        setLoading(true);
        setMessage('');

        try {
            const payload = {
                ...form,
                created_by: createdBy
            };

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/add/clients`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message || 'Failed to register client');
            }

            setMessage('✅ Client registered successfully.');
            setTimeout(() => router.push('/clients/list'), 1500);
        } catch (error) {
            console.error('Error:', error);
            setMessage(`❌ ${error.message || 'An error occurred. Please try again.'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-50">
            <OfficerNav />

            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="mb-6">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-2"
                    >
                        <FiArrowLeft className="mr-2" />
                        Go Back
                    </button>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                        Register New Client
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Fill in the details below to register a new client
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {message && (
                        <div className={`p-4 ${
                            message.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                        }`}>
                            <p className="font-medium">{message}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="space-y-4">
                            {/* Name Field */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiUser className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={form.name}
                                        onChange={handleChange}
                                        className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            {/* NRC Field */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    NRC Number
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaIdCard className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="nrc"
                                        required
                                        value={form.nrc}
                                        onChange={handleChange}
                                        className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="12/ABC(N)123456"
                                    />
                                </div>
                            </div>

                            {/* Phone Field */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiPhone className="text-gray-400" />
                                    </div>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        value={form.phone}
                                        onChange={handleChange}
                                        className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="09123456789"
                                    />
                                </div>
                            </div>

                            {/* Business Field */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Business Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiBriefcase className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="business"
                                        required
                                        value={form.business}
                                        onChange={handleChange}
                                        className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="ABC Enterprises"
                                    />
                                </div>
                            </div>

                            {/* Location Field */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Location
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiMapPin className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="location"
                                        required
                                        value={form.location}
                                        onChange={handleChange}
                                        className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="City, Township"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-sm transition-colors w-full sm:w-auto"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : 'Register Client'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <Footer/>
        </main>
    );
}