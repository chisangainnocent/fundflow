'use client';

import dynamic from 'next/dynamic';
import OfficerNav from "@/components/OfficerNav";
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiPlus } from 'react-icons/fi';
import Footer from "@/components/Footer";

// Disable SSR for jQuery component
const ClientList = dynamic(() => import('@/components/ClientList'), { ssr: false });

export default function ClientsPage() {
    const router = useRouter();

    return (
        <main className="min-h-screen bg-slate-50">
            <OfficerNav />

            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex flex-col sm:flex-row justify-items-center items-start sm:items-center mb-8 gap-4">
                    <div className="mr-auto ">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                        >
                            <FiArrowLeft className="mr-2" />
                            Go Back
                        </button>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mt-2">
                            Client Management
                        </h1>
                        <p className="text-gray-600 mt-1">
                            View and manage all registered clients
                        </p>
                    </div>

                    <button
                        onClick={() => router.push("/clients/new")}
                        className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-2 py-2 rounded-lg shadow-sm transition-colors"
                    >
                        <FiPlus className="mr-2" />
                        Add Client

                    </button>

                    <button
                        onClick={() => router.push("/loans/new")}
                        className="flex items-center bg-green-600 hover:bg-green-700 text-white px-2 py-2 rounded-lg shadow-sm transition-colors"
                    >
                        <FiPlus className="mr-2" />
                        Issue Loan

                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-1 bg-gradient-to-r from-blue-50 to-gray-50 border-b border-gray-200">
                        <h2 className="px-5 py-3 font-semibold text-gray-700">
                            Registered Clients
                        </h2>
                    </div>
                    <div className="p-5">
                        <ClientList />
                    </div>
                </div>
            </div>
            <Footer/>
        </main>
    );
}