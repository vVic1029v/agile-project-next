"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

interface PageBodyWrapperProps {
  children: React.ReactNode;
}

const PageBodyWrapper: React.FC<PageBodyWrapperProps> = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <nav
        className={`bg-gray-800 text-white transition-all duration-300 flex-shrink-0 ${
          isExpanded ? "w-64" : "w-16"
        } h-full flex flex-col`}
      >
        {/* Toggle Button */}
        <div className="flex items-center justify-center h-16 border-b border-gray-700">
          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            className="text-white focus:outline-none"
            aria-label="Toggle Navigation"
          >
            {isExpanded ? (
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                stroke="currentColor"
                fill="none"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                stroke="currentColor"
                fill="none"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 p-2">
          <ul>
            <li>
              <Link href="/dashboard" className="flex items-center space-x-3">
                <svg className="h-6 w-6" stroke="currentColor" fill="none">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6"
                  />
                </svg>
                {isExpanded && <span>Dashboard</span>}
              </Link>
            </li>
          </ul>
        </div>

        {/* Sign Out Button */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={() => signOut()}
            className="w-full flex items-center justify-center py-2 px-4 bg-red-500 hover:bg-red-600 rounded-md"
          >
            <svg className="h-5 w-5 mr-2" stroke="currentColor" fill="none">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 01-2-2h6a2 2 0 012 2v1"
              />
            </svg>
            {isExpanded && <span>Sign Out</span>}
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-auto bg-gray-100">
        {children}
      </main>
    </div>
  );
};

export default PageBodyWrapper;
