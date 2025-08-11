"use client"

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import OfficerNav from "@/components/OfficerNav";
import { FiArrowLeft } from "react-icons/fi";
import Footer from "@/components/Footer";

export default function UserEdit() {
    const params = useParams();
    const user_id = params?.id;
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState(null);

    const [userdata, setUserData] = useState({
        fname: "",
        lname: "",
        email: "",
        role: "",
        user_status: ""
    });

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/${user_id}`);
                if (!res.ok) throw new Error("Failed to fetch user data");
                const user_data = await res.json();
                const single_user = user_data.user
                console.log(single_user.user);
                if (single_user.length > 0) {
                    setUserData({
                        fname: single_user[0].fname || "",
                        lname: single_user[0].lname || "",
                        email: single_user[0].email || "",
                        role: single_user[0].role || "",
                        user_status: single_user[0].user_status || ""
                    });
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        if (user_id) fetchUser();
    }, [user_id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);
        setError(null);

        try {
            // Basic validation
            if (!userdata.fname || !userdata.lname || !userdata.email) {
                throw new Error("Please fill in all required fields");
            }

            const formData = new FormData();
            formData.append('fname', userdata.fname);
            formData.append('lname', userdata.lname);
            formData.append('role', userdata.role);
            formData.append('email', userdata.email);
            formData.append('user_status', userdata.user_status);

            console.log(Object.fromEntries(formData.entries()));

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/update/${user_id}`, {
                method: "POST",
                // headers: {
                //     'Authorization': `Bearer ${localStorage.getItem('token')}` // Add your auth token
                // },
                body: formData
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Update failed");
            }

            alert("User updated successfully!");
            router.refresh(); // Better than window.location.reload()

        } catch (err) {
            setError(err.message);
            alert(err.message);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return (
        <main className="min-h-screen bg-slate-50 flex items-center justify-center">
            <p className="text-gray-500 text-lg">Loading User Details...</p>
        </main>
    );

    if (error) return (
        <main className="min-h-screen bg-slate-50 flex items-center justify-center">
            <p className="text-red-500 text-lg">Error: {error}</p>
            <button
                onClick={() => window.location.reload()}
                className="ml-4 text-blue-600 hover:text-blue-800"
            >
                Retry
            </button>
        </main>
    );

    return (
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

                <h2 className="text-2xl font-semibold mb-6">Edit User: {userdata.fname} {userdata.lname}</h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block mb-2 font-medium">First Name*</label>
                            <input
                                name='fname'
                                className="border p-2 rounded w-full"
                                value={userdata.fname}
                                onChange={(e) => setUserData({ ...userdata, fname: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-medium">Last Name*</label>
                            <input
                                name='lname'
                                className="border p-2 rounded w-full"
                                value={userdata.lname}
                                onChange={(e) => setUserData({ ...userdata, lname: e.target.value })}
                                required
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block mb-2 font-medium">Email*</label>
                            <input
                                type="email"
                                name='email'
                                className="border p-2 rounded w-full"
                                value={userdata.email}
                                onChange={(e) => setUserData({ ...userdata, email: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-medium">Role</label>
                            <select
                                name='role'
                                className="border p-2 rounded w-full"
                                value={userdata.role}
                                onChange={(e) => setUserData({ ...userdata, role: e.target.value })}
                            >
                                <option value="">Select Role</option>
                                <option value="admin">Admin</option>
                                <option value="user">Officer</option>
                                <option value="manager">Manager</option>
                            </select>
                        </div>

                        <div>
                            <label className="block mb-2 font-medium">Status</label>
                            <select
                                name="user_status"
                                className="border p-2 rounded w-full"
                                value={userdata.user_status}
                                onChange={(e) => setUserData({ ...userdata, user_status: e.target.value })}
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="suspended">Suspended</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={updating}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded disabled:opacity-50"
                    >
                        {updating ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>

            <Footer />
        </main>
    );
}