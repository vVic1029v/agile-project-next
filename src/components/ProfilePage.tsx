"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {motion} from "framer-motion";
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");


  useEffect(() => {
    console.log("Session:", session);

    if (session?.user) {
      fetch(`/api/user?userId=${session.user.id}`) 
        .then((res) => {
          if (!res.ok) {
            throw new Error("Eroare la fetch /api/user");
          }
          return res.json();
        })
        .then((data: { message: string, user: User }) => {
          console.log("User data:", data); 
          setUser(data.user); 
          setLoading(false); 
        })
        .catch((error) => {
          console.error("Fetch error:", error);
          setLoading(false); 
        });
    } else {
      setLoading(false); 
    }
  }, [session]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-blue-300">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-3xl text-white font-semibold mb-4"
          >
            Please wait...
          </motion.h2>
          <motion.div
            className="w-16 h-16 border-4 border-t-4 border-blue-300 border-solid rounded-full animate-spin mx-auto"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        </motion.div>
      </div>
    );
  }
  if (!session?.user || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-blue-300">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-3xl text-white font-semibold mb-4"
          >
            You are not logged in
          </motion.h2>
        
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl text-white mt-4"
          >
            Please log in for accesing this page.
          </motion.p>
        </motion.div>
      </div>
    );
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!session) {
      setError("You must be logged in to change your password.");
      return;
    }
  
    if (!newPassword) {
      setError("New password is required.");
      return;
    }
  
    try {
      const response = await fetch("/api/user-reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newPassword, 
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setMessage("Password changed successfully.");
        setError("");
      } else {
        setError(data.error || "Something went wrong.");
        setMessage("");
      }
    } catch (error) {
      setError("An error occurred while changing the password.");
      setMessage("");
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-blue-300">
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between"
    >

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="w-full sm:w-3/5 mb-8 sm:mb-0"
      >
         <motion.h1
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                whileHover={{ scale: 1.05 }}
                className="text-1xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600 mb-8"
              >
            My account             
             </motion.h1>

        <h2 className="text-2xl text-gray-800  mb-2">Name: {user.firstName} {user.lastName}</h2>
        <h2 className="text-lg text-gray-700  mb-4">Email: {user.email}</h2>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h1 className="text-2xl font-semibold  text-gray-800 mb-4">Change Password</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700" htmlFor="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                placeholder="Current password"
              />
            </div>
            <div>
              <label className="block text-gray-700" htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                placeholder="New password"
              />
            </div>
            <div className="mt-6 text-center">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit" 
                className="mt-4 w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700  transition duration-200"
              >
                New Password
              </motion.button>
            </div>
          </form>

          {error && <p className="text-red-500 text-center mt-3">{error}</p>}
          {message && <p className="text-green-500 text-center mt-3">{message}</p>}
        </motion.div>
      </motion.div>

      <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="w-full sm:w-2/5 flex justify-center items-center"
        >
          <motion.div 
            whileHover={{ scale: 1.1, boxShadow: "0px 10px 20px rgba(0, 0, 255, 0.3)" }} 
            transition={{ duration: 0.3 }}
            className="w-60 h-60 bg-gradient-to-r from-cyan-300 to-blue-500 rounded-lg shadow-xl flex items-center justify-center border-8 border-white"
          >
            {user.profileImage ? (
              <img src={user.profileImage} alt="Poza Profil" className="w-full h-full object-cover rounded-lg" />
            ) : (
              <span className="text-white text-4xl font-bold">?</span>
            )}
          </motion.div>
        </motion.div>
        
      </motion.div>
  </div>
  );
}
