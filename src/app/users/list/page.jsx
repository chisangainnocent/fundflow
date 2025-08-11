'use client';

import OfficerNav from "@/components/OfficerNav";
import Footer from "@/components/Footer";
import {useEffect, useState} from "react";
import {FiArrowLeft} from "react-icons/fi";
import {useRouter} from "next/navigation";
import Link from "next/link";

export default function Users(){
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        async function fetchUsers() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`);
                if (!res.ok) throw new Error("Failed to fetch users data");
                const json = await res.json();
                setUsers(json.users);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchUsers();
    }, []);

    if (loading) return (
        <main className="min-h-screen bg-slate-50 flex items-center justify-center">
            <p className="text-gray-500 text-lg">Loading Users...</p>
        </main>
    );

    if (error) return (
        <main className="min-h-screen bg-slate-50 flex items-center justify-center">
            <p className="text-red-500 text-lg">Error: {error}</p>
        </main>
    );


    return(
        <main className="min-h-screen bg-slate-50">
            <OfficerNav />

            <div className="max-w-4xl mx-auto px-4 py-8">
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-blue-600 hover:text-blue-800 mb-5 transition-colors"
                >
                    <FiArrowLeft className="mr-2" />
                    Go Back
                </button>


                <h2>All system users</h2>


                <div className="w-full mx-auto p-5 overflow-x-auto">
                    {loading ? (
                        <p className="text-gray-500">Loading Users...</p>
                    ) : error ? (
                        <p className="text-gray-500">No User found.</p>
                    ) : (
                        <table className="min-w-full text-sm text-left text-gray-700">
                            <thead className="bg-gray-100 border-b border-gray-300 text-xs uppercase font-medium">
                            <tr>
                                <th className="px-1 py-3">#</th>
                                <th className="px-1 py-3">User ID</th>
                                <th className="px-1 py-3">Firstname</th>
                                <th className="px-1 py-3">Lastname</th>
                                <th className="px-1 py-3">Role</th>
                                <th className="px-1 py-3">Email</th>
                                <th className="px-1 py-3">Status</th>
                                <th className="px-1 py-3">Options</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            {users.map((user, index) => (
                                <tr key={user.user_id} className="hover:bg-blue-50 transition">
                                    <td className="px-4 py-2">{index + 1}</td>
                                    <td className="px-4 py-2">{user.user_id}</td>
                                    <td className="px-4 py-2">{user.fname}</td>
                                    <td className="px-4 py-2">{user.lname}</td>
                                    <td className="px-4 py-2">{user.role}</td>
                                    <td className="px-4 py-2">{user.email}</td>
                                    <td className="px-4 py-2">{user.user_status}</td>
                                    <td className="px-4 py-2">
                                        <Link
                                            href={`/users/edit/${user.user_id}`}
                                            className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 my-2 rounded"
                                        >
                                            View User
                                        </Link>

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