"use client";
import { useState, useEffect } from "react";
import { useSession, getSession } from "next-auth/react";
import {motion} from "framer-motion";
import Image from 'next/image';
import Link from "next/link";
import { ChangeProfilePicture } from "@/lib/database/database";
import { ChangePicture, RemovePicture } from "@/lib/actions";
import router from "next/router";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage: string| null;
}

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [removeSucces, SetRemoveSuccess] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setUser(session.user);  
      setProfileImage(session.user.profileImage ?? null);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (uploadSuccess) {
      const timer = setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [uploadSuccess]);

  useEffect(() => {
    if (removeSucces) {
      const timer = setTimeout(() => {
        SetRemoveSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [removeSucces]);

  const handleRemovePicture = async () => {
    if (!session?.user.id) return;
    await RemovePicture(session.user.id);
    SetRemoveSuccess(true);
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-100">
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
            className="w-16 h-16 border-4 border-t-4 border-neutral-300 border-solid rounded-full animate-spin mx-auto"
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
      <div className="min-h-screen flex items-center justify-center bg-neutral-100">
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
            {/* access denied */}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl text-white mt-4"
          >
            Please log in for accessing this page.
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !session?.user.id) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("userId", session.user.id);

    try {
      const response = await fetch("/api/upload-profile-image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setUploadSuccess(true);
        setProfileImage(data.imageUrl);
        ChangePicture(session.user.id, data.imageUrl);
        setSelectedFile(null);
      } else {
        setError(data.error || "Error uploading image.");
      }
    } catch (error) {
      setError("An error occurred while uploading the image.");
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-[url('/uploads/frontyard.webp')] px-4 z[-2]"
    >
       <div className="absolute inset-0 bg-black bg-opacity-70 z[-1] w-full h-full"></div>
      <motion.div
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="bg-neutral-100 p-8 rounded-3xl shadow-2xl w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between z-10"
      >
        <motion.div
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
          className="w-full sm:w-3/5 mb-8 sm:mb-0"
        >
          <motion.h1
            
            className="text-3xl sm:text-4xl font-extrabold  text-neutral-800 mb-8"
          >
            My account
          </motion.h1>

          <h2 className="text-2xl text-neutral-800 mb-2">Name: {user.firstName} {user.lastName}</h2>
          <h2 className="text-lg text-neutral-700 mb-4">Email: {user.email}</h2>
          <Link href="/myclass">
            <motion.button
             
              whileTap={{ scale: 0.95 }}
              className="mb-5 px-6 py-2 bg-neutral-800 text-white rounded-lg shadow-lg hover:bg-neutral-700"
            >
              My class
            </motion.button>
          </Link>
          <motion.div>
            <h1 className="text-2xl font-semibold text-neutral-800 mb-4">Change Password</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-neutral-700" htmlFor="currentPassword">
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-500 transition duration-200 bg-neutral-100"
                  placeholder="Current password"
                />
              </div>
              <div>
                <label className="block text-neutral-700" htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-500 transition duration-200 bg-neutral-100"
                  placeholder="New password"
                />
              </div>
              <div className="mt-6 text-center">
                <motion.button
                 
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="mt-4 w-full py-3 bg-neutral-800 text-white rounded-xl shadow-lg hover:bg-neutral-700"
                >
                  New Password
                </motion.button>
              </div>
            </form>

            {error && <p className="text-red-500 text-center mt-3">{error}</p>}
            {message && <p className="text-green-500 text-center mt-3">{message}</p>}
          </motion.div>
        </motion.div>
        <motion.div className="w-full sm:w-2/5 flex flex-col justify-center items-center">
          <motion.div
            whileHover={{ scale: 1.1, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.3)" }}
            transition={{ duration: 0.3 }}
            className="w-60 h-60 bg-gradient-to-r from-neutral-300 to-neutral-500 rounded-lg shadow-xl flex items-center justify-center border-8 border-neutral-100 cursor-pointer relative overflow-hidden"
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            <Image
              src={imagePreview ?? profileImage ?? "https://res.cloudinary.com/dqdn7bvwq/image/upload/v1743249741/user_uploads/82eee357-2864-40e7-8715-e9734bd0cbb6/82eee357-2864-40e7-8715-e9734bd0cbb6-1743249742588.jpg"}
              width={500}
              height={300}
              alt="Profile Picture"
              className="w-full h-full object-cover"
              priority
            />
            <input type="file" accept="image/*" id="fileInput" className="hidden" onChange={handleFileChange} />
          </motion.div>
          {selectedFile && !uploadSuccess && (
            <button
              onClick={handleUpload}
              className="mt-4 bg-neutral-800 text-white px-4 py-2 rounded transition-all duration-300 ease-in-out hover:bg-neutral-700 hover:scale-105 hover:shadow-xl hover:ring-2 hover:ring-neutral-300 focus:outline-none"
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
          )}
          {uploadSuccess && (
            <p className="ml-4 mt-4 text-green-300 font-semibold">Image changed, please relog to see the changes</p>
          )}
          {removeSucces && (
            <p className="ml-4 mt-4 text-red-600 font-semibold">Image removed, please relog to see the changes</p>
          )}
          <button
            onClick={handleRemovePicture}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded transition-all duration-300 ease-in-out hover:bg-red-600 hover:scale-105 hover:shadow-xl hover:ring-2 hover:ring-red-300 focus:outline-none"
          >
            Remove Picture
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
