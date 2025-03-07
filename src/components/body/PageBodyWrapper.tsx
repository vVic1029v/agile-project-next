"use client";
import Link from "next/link";
import { FaHome } from "react-icons/fa";
import { MdConstruction, MdMessage, MdClass } from "react-icons/md";
import { HiCalendar, HiOutlineCalendar } from "react-icons/hi";
import { GrAnnounce } from "react-icons/gr";
import { IoPersonSharp } from "react-icons/io5";
import { signOut, useSession } from "next-auth/react";
import { ReactNode, useState } from "react";

interface MyComponentProps {
  children: ReactNode;  // Specifică faptul că această componentă acceptă un prop children
}
const PageBodyWrapper : React.FC<MyComponentProps> = ({ children }) => {
  const { data: session } = useSession();
  const userType = session?.user?.userType || ""; // Evită erorile dacă session nu este încărcat
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <nav
        className={`bg-blue-950 text-white transition-all duration-300 flex-shrink-0 ${
          isExpanded ? "w-64" : "w-20"
        } h-full flex flex-col`}
      >
        {/* Toggle Button */}
        <div className="flex items-center h-16 border-b border-gray-700 px-4">
          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            className="text-white focus:outline-none focus:ring-0 ml-auto"
            aria-label="Toggle Navigation"
          >
            {isExpanded ? (
              <svg className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            ) : (
              <svg className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 p-2">
          <ul>
            <li>
              <Link href="/home" className="flex items-center space-x-3 py-2 px-4 rounded-md hover:bg-gray-700 transition-all duration-200">
                <FaHome className="h-6 w-6 flex-shrink-0" />
                <span className={`truncate transition-all duration-200 ${isExpanded ? "opacity-100" : "opacity-0"}`}>
                  Home
                </span>
              </Link>
            </li>

            {userType === "FACULTYMEMBER" && (
              <li>
                <Link href="/new/course" className="flex items-center space-x-3 py-2 px-4 rounded-md hover:bg-gray-700 transition-all duration-200">
                  <MdConstruction className="h-6 w-6 flex-shrink-0" />
                  <span className={`truncate transition-all duration-200 ${isExpanded ? "opacity-100" : "opacity-0"}`}>
                    Courses
                  </span>
                </Link>
              </li>
            )}

            <li>
              <Link href="/calendar/year" className="flex items-center space-x-3 py-2 px-4 rounded-md hover:bg-gray-700 transition-all duration-200">
                <HiCalendar className="h-6 w-6 flex-shrink-0" />
                <span className={`truncate transition-all duration-200 ${isExpanded ? "opacity-100" : "opacity-0"}`}>
                  Year Calendar
                </span>
              </Link>
            </li>

            <li>
              <Link href="/calendar/week" className="flex items-center space-x-3 py-2 px-4 rounded-md hover:bg-gray-700 transition-all duration-200">
                <HiOutlineCalendar className="h-6 w-6 flex-shrink-0" />
                <span className={`truncate transition-all duration-200 ${isExpanded ? "opacity-100" : "opacity-0"}`}>
                  Week Calendar
                </span>
              </Link>
            </li>

            <li>
              <Link href="/announcements" className="flex items-center space-x-3 py-2 px-4 rounded-md hover:bg-gray-700 transition-all duration-200">
                <GrAnnounce className="h-6 w-6 flex-shrink-0" />
                <span className={`truncate transition-all duration-200 ${isExpanded ? "opacity-100" : "opacity-0"}`}>
                  Announcements
                </span>
              </Link>
            </li>

            <li>
              <Link href="/messages" className="flex items-center space-x-3 py-2 px-4 rounded-md hover:bg-gray-700 transition-all duration-200">
                <MdMessage className="h-6 w-6 flex-shrink-0" />
                <span className={`truncate transition-all duration-200 ${isExpanded ? "opacity-100" : "opacity-0"}`}>
                  Messages
                </span>
              </Link>
            </li>

            <li>
              <Link href="/myclass" className="flex items-center space-x-3 py-2 px-4 rounded-md hover:bg-gray-700 transition-all duration-200">
                <MdClass className="h-6 w-6 flex-shrink-0" />
                <span className={`truncate transition-all duration-200 ${isExpanded ? "opacity-100" : "opacity-0"}`}>
                  My Class
                </span>
              </Link>
            </li>

            <li>
              <Link href="/myaccount" className="flex items-center space-x-3 py-2 px-4 rounded-md hover:bg-gray-700 transition-all duration-200">
                <IoPersonSharp className="h-6 w-6 flex-shrink-0" />
                <span className={`truncate transition-all duration-200 ${isExpanded ? "opacity-100" : "opacity-0"}`}>
                  My Account
                </span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Sign Out Button */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={() => signOut()}
            className="w-full flex items-center justify-center py-2 px-4 bg-gray-600 hover:bg-gray-700 rounded-md transition-all duration-200 ease-in-out"
          >
            <svg className="h-5 w-5 mr-2 flex-shrink-0" stroke="currentColor" fill="none">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 01-2-2h6a2 2 0 012 2v1" />
            </svg>
            <span className={`truncate transition-all duration-200 ${isExpanded ? "opacity-100" : "opacity-0"}`}>
              Sign Out
            </span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-auto">{/* bg-gray-100 */}

        {children}
      </main>
    </div>
  );
}
export default PageBodyWrapper;