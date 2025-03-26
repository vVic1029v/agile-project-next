"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setIsLoading(false);

    if (res?.error) {
      setError("Invalid credentials");
    } else {
      window.location.href = "/home";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-5xl h-[600px] bg-neutral-800 rounded-2xl shadow-xl flex flex-col sm:flex-row overflow-hidden"
      >
        {/* Secțiunea Formularului */}
        <div className="w-full sm:w-1/2 flex justify-center items-center p-6 sm:p-10">
          <div className="w-full max-w-sm bg-neutral-800 p-8 rounded-xl">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-100 mb-8 text-center">
              Welcome Back!
              <br />
              Sign In
            </h1>

            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-neutral-600 text-neutral-50 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-neutral-500 transition"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-neutral-600 text-neutral-50 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-neutral-500 transition"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-neutral-500 text-neutral-50 rounded-md hover:bg-neutral-400 transition focus:ring-2 focus:ring-neutral-300"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </button>
            </form>
          </div>
        </div>

        {/* Dreapta - Imagine (ascunsă pe mobile) */}
        <div
          className="hidden sm:block w-1/2 bg-cover bg-center"
          style={{
            backgroundImage: "url('/uploads/logincampus.webp')",
            backgroundPosition: "70% center",
          }}
        ></div>
      </motion.div>
    </div>
  );
}
