"use client"; // Required for interactivity in App Router

import { useState } from "react";
import { useRouter } from 'next/navigation';
import LogoutComponent from "@/components/LogoutComponent";
import Footer from "@/components/Footer";
import Image from "next/image";



export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [error, setError ] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const { status, message, data } = await res.json();



      if (status !== "success") {
        setError(message || "Login failed");
        return;
      }

      const userData = {
        user_id: data.user_id,
        email: data.email,
        fname: data.fname,
        lname: data.lname,
        user_role: data.user_role,
      };

      localStorage.setItem("user", JSON.stringify(userData));

      if(data.user_role == "admin"){
        router.push('/dashboard');
      }else{
        router.push('/user-dashboad');
      }


      // TODO: Redirect or navigate to dashboard here
    } catch (error) {
      setError("Something went wrong.");
    }
  };

  return (
      <>
        <LogoutComponent />
      <div className="font-sans grid grid-rows-[20px_1fr_20px] min-h-screen bg-gray-50">
        <div></div>

        <div className="flex items-center justify-center px-4">
          <div className="w-full max-w-sm bg-white shadow-xl rounded-lg p-6">
           <div className="flex flex-col items-center justify-center">
             <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300">
               <Image
                   width={100}
                   height={100}
                   className="object-cover w-full h-full"
                   alt="FundFlow logo"
                   src="/logo.png"
               />
             </div>
             <h2 className="text-2xl font-bold lowercase text-gray-800 pb-3">
               Login to continue
             </h2>
           </div>
            { error ? (
                    <p className="text-red-500 text-center">{error}</p>
                ) : (
                    <p></p>
            )
            }
            <form className="space-y-3" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email address</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mt-1 px-4 py-2 border text-black rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                    name="email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mt-1 px-4 py-2 border text-black rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                    name="password"
                />
              </div>
              <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition"
              >
                Sign In
              </button>
            </form>
            <p className="text-sm text-center text-gray-500">
              Forgot password?{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Reset here
              </a>
            </p>
          </div>
        </div>

       <Footer/>
      </div>
      </>
  );
}
