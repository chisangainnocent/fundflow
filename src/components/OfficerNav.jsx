"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import Link from 'next/link';

export default function OfficerNav() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [greeting, setGreeting] = useState(null);
    const [user_data, setUserData] = useState('');

    useEffect(() => {
        // Get user data from localStorage
        if (typeof window !== 'undefined') {
            const user_data = localStorage.getItem('user');
            if (user_data) {
                const parsedData = JSON.parse(user_data);
                setUserData(parsedData);
                setUser(parsedData);
            }
        }
    },[])

    const handleLogout = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/logout`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            const { status, message } = await res.json();
            if (status !== "success") {
                alert(message || "Logout failed");
                return;
            }

            localStorage.clear();
            router.push('/');
        } catch (error) {
            console.error("Logout error:", error);
            alert("Something went wrong.");
        }
    };

    useEffect(()=>{
        const tellTime = () =>{
            let now = new Date();
            let hours = now.getHours();
            let minutes = now.getMinutes();

            let totalMinutes = hours * 60 +minutes;
            let morningStart = 0;
            let morningEnd = 11 * 60 + 59;
            let afternoonStart = 12 * 60;
            let afternoonEnd = 17 * 60 + 59;


            if (totalMinutes >= morningStart && totalMinutes <= morningEnd){
                return 'Good morning';
            } else if (totalMinutes >= afternoonStart && totalMinutes <= afternoonEnd){
                return 'Good Afternoon';
            }else{
                return 'Good Evening';
            }
        }

        setGreeting(tellTime());
    },[])



    return (
        <>
            {/* HEADER */}
            <header className="bg-blue-600 text-white py-4 shadow">
                <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
                    {
                        user_data.user_role === "admin" ? (
                            <Link href={"/dashboard"}>
                                <h1 className="text-xl font-semibold">📋 Dashboard</h1>
                            </Link>
                        ) : (
                            <Link href={"/user-dashboad"}>
                                <h1 className="text-xl font-semibold">📋 Dashboard</h1>
                            </Link>
                        )
                    }
                    {user && (
                        <div className="text-sm">
                            <span className="mr-4">{greeting}, {user.fname}</span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </header>
            </>
    );
}
