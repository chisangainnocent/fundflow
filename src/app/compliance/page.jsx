"use client";

import OfficerNav from "@/components/OfficerNav";
import Link from 'next/link';
import Footer from "@/components/Footer";
import { FiArrowLeft, FiDownload } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Compliance() {
    const router = useRouter();
    const [zra, setZra] = useState({
        due_date: "",
        last_filed: "",
        unique_id: "",
        file_path: "",
        status: ""
    });
    const [pacra, setPacra] = useState({
        last_filed: "",
        due_date: "",
        unique_id: "",
        file_path: "",
        status: ""
    });
    const [loading, setLoading] = useState(true);
    const [file, setFile] = useState(null);
    const [pacraFile, setPacraFile] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const resZra = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/compliance/zra`);
                const zraData = await resZra.json();
                if (zraData.length > 0) {
                    setZra({
                        due_date: zraData[0].due_date || "",
                        last_filed: zraData[0].last_filed || "",
                        unique_id: zraData[0].unique_id || "",
                        file_path: zraData[0].file_path || "",
                        status: zraData[0].status || ""
                    });
                }

                const resPacra = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/compliance/pacra`);
                const pacraData = await resPacra.json();
                if (pacraData.length > 0) {
                    setPacra({
                        last_filed: pacraData[0].last_filed || "",
                        due_date: pacraData[0].due_date || "",
                        unique_id: pacraData[0].unique_id || "",
                        file_path: pacraData[0].file_path || "",
                        status: pacraData[0].status || ""
                    });
                }
            } catch (err) {
                console.error("Error fetching compliance data", err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const updateZra = async () => {
        const formData = new FormData();
        formData.append('due_date', zra.due_date);
        formData.append('last_filed', zra.last_filed);
        formData.append('unique_id', zra.unique_id);
        if (file) {
            formData.append('proof', file);
        }

        //console.log(Object.fromEntries(formData.entries()));

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/compliance/zra`, {
            method: "POST",
            body: formData
        });

        const data = await res.json();
        alert(data.message);
        window.location.reload(); // Refresh to show updated status
    };

    const updatePacra = async () => {
        const formData = new FormData();
        formData.append('due_date', pacra.due_date);
        formData.append('last_filed', pacra.last_filed);
        formData.append('unique_id', pacra.unique_id);
        if (pacraFile) {
            formData.append('proof', pacraFile);
        }

        //console.log(Object.fromEntries(formData.entries()));

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/compliance/pacra`, {
            method: "POST",
            body: formData
        });
        const data = await res.json();
        alert(data.message);
        window.location.reload(); // Refresh to show updated status
    };

    const getStatusBadge = (status) => {
        if (!status) return null;

        const baseClass = "px-2 py-1 rounded text-xs font-medium";
        if (status === 'REMINDER') {
            return <span className={`${baseClass} bg-yellow-300 text-white`}>Reminder (Due Soon)</span>;
        } else if (status === 'OVERDUE') {
            return <span className={`${baseClass} bg-red-700 text-white`}>Overdue</span>;
        }else {
            return <span className={`${baseClass} bg-green-700 text-white`}>Complaint</span>;
        }
    };

    //if (loading) return <p className="p-6">Loading...</p>;

    return (
        <main className="min-h-screen bg-slate-50">
            <OfficerNav />
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center mb-8 gap-4">
                    <div className="mr-auto">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                        >
                            <FiArrowLeft className="mr-2" />
                            Go Back
                        </button>
                        <h1 className="text-3xl font-bold text-gray-800 mt-2">Compliance Tracker</h1>
                        <p className="text-gray-600 mt-1">Manage ZRA & PACRA compliance (Admin Only)</p>
                    </div>
                </div>

                {/* ZRA Section */}
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">ZRA Filing</h2>
                        {getStatusBadge(zra.status)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block mb-2">TPIN</label>
                            <input
                                type="text"
                                className="border p-2 rounded w-full"
                                value={zra.unique_id}
                                onChange={(e) => setZra({ ...zra, unique_id: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Last Filed Date</label>
                            <input
                                type="date"
                                className="border p-2 rounded w-full"
                                value={zra.last_filed}
                                onChange={(e) => setZra({ ...zra, last_filed: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Next Due Date</label>
                            <input
                                type="date"
                                className="border p-2 rounded w-full"
                                value={zra.due_date}
                                onChange={(e) => setZra({ ...zra, due_date: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Upload Proof</label>
                            <input
                                type="file"
                                className="border p-2 rounded w-full"
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                        </div>
                    </div>

                    {zra.file_path && (
                        <div className="mb-4">
                            <label className="block mb-2">Current File</label>
                            <Link
                                href={`${process.env.NEXT_PUBLIC_API_URL}${zra.file_path}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-blue-600 hover:underline"
                            >
                                <FiDownload className="mr-2" />
                                Download Proof
                            </Link>
                        </div>
                    )}

                    <button
                        onClick={updateZra}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                        Save ZRA
                    </button>
                </div>

                {/* PACRA Section - Similar structure with appropriate labels */}
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">PACRA Filing</h2>
                        {getStatusBadge(pacra.status)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block mb-2">Business Number</label>
                            <input
                                type="text"
                                className="border p-2 rounded w-full"
                                value={pacra.unique_id}
                                onChange={(e) => setPacra({ ...pacra, unique_id: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Last Filed Date</label>
                            <input
                                type="date"
                                className="border p-2 rounded w-full"
                                value={pacra.last_filed}
                                onChange={(e) => setPacra({ ...pacra, last_filed: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Next Due Date</label>
                            <input
                                type="date"
                                className="border p-2 rounded w-full"
                                value={pacra.due_date}
                                onChange={(e) => setPacra({ ...pacra, due_date: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Upload Proof</label>
                            <input
                                type="file"
                                className="border p-2 rounded w-full"
                                onChange={(e) => setPacraFile(e.target.files[0])}
                            />
                        </div>
                    </div>

                    {pacra.file_path && (
                        <div className="mb-4">
                            <label className="block mb-2">Current File</label>
                            <Link
                                href={`${process.env.NEXT_PUBLIC_API_URL}${pacra.file_path}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-blue-600 hover:underline"
                            >
                                <FiDownload className="mr-2" />
                                Download Proof
                            </Link>
                        </div>
                    )}

                    <button
                        onClick={updatePacra}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                        Save PACRA
                    </button>
                </div>
                {/* ... */}
            </div>
            <Footer />
        </main>
    );
}