"use client";
import Link from "next/link";
import { FaHome } from "react-icons/fa";
import { MdConstruction, MdClass } from "react-icons/md";
import { HiOutlineCalendar } from "react-icons/hi";
import { GrAnnounce } from "react-icons/gr";
import { IoPersonSharp } from "react-icons/io5";
import { signOut, useSession } from "next-auth/react";
import { ReactNode, useState } from "react";
import { SiGoogleclassroom } from "react-icons/si";
import { IoExitOutline } from "react-icons/io5"; 
interface MyComponentProps {
  children: ReactNode;
}

const PageBodyWrapper: React.FC<MyComponentProps> = ({ children }) => {
  const { data: session } = useSession();
  const userType = session?.user?.userType || "";
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden z-800">
      {/* Mobile Toggle Button */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="md:hidden absolute top-4 left-4 z-50 p-3 bg-black text-white rounded-lg text-xl"
          aria-label="Open Navigation"
        >
          ☰
        </button>
      )}

      {/* Sidebar */}
   {/* Sidebar */}  
<nav
   className={`bg-neutral-900 text-white transition-all duration-300 fixed md:relative z-50 h-full  ${
    isExpanded ? "w-screen md:w-64" : "w-20"
  } ${isExpanded ? "left-0" : "-left-full md:left-0"}`}
>

  {/* Toggle Button - SUS DE TOT */}
  <div className="w-full flex justify-center py-4">
    <button
      onClick={() => setIsExpanded((prev) => !prev)}
      className="text-white text-xl bg-gray-500 hover:bg-gray-600 p-2 rounded-md transition"
      aria-label="Toggle Navigation"
    >
      {isExpanded ? "←" : "→"}
    </button>
  </div>

  {/* Navigation Links */}
  <div className="flex-1 p-4 mt-4 ">
    <ul className="space-y-1 flex flex-col items-center w-full">
      <li>
        <Link href="/home"   onClick={() => setIsExpanded(false)} className="flex flex-col items-center justify-center py-3 px-5 rounded-md hover:bg-gray-700 transition-all duration-200">
          <FaHome className="h-6 w-6 flex-shrink-0" />
          {isExpanded && <span className="mt-1">Home</span>}
        </Link>
      </li>

      <li>
        <Link href="/calendar" onClick={() => setIsExpanded(false)} className="flex flex-col items-center justify-center py-3 px-5 rounded-md hover:bg-gray-700 transition-all duration-200">
          <HiOutlineCalendar className="h-6 w-6 flex-shrink-0" />
          {isExpanded && <span className="mt-1">Calendar</span>}
        </Link>
      </li>

      {userType === "FACULTYMEMBER" && (
        <li>
          <Link href="/new/home-class"  onClick={() => setIsExpanded(false)} className="flex flex-col items-center justify-center py-3 px-5 rounded-md hover:bg-gray-700 transition-all duration-200">
            <SiGoogleclassroom className="h-6 w-6 flex-shrink-0" />
            {isExpanded && <span className="mt-1">Create HomeClass</span>}
          </Link>
        </li>
      )}

      {userType === "FACULTYMEMBER" && (
        <li>
          <Link href="/new/course" onClick={() => setIsExpanded(false)} className="flex flex-col items-center justify-center py-3 px-5 rounded-md hover:bg-gray-700 transition-all duration-200">
            <MdConstruction className="h-6 w-6 flex-shrink-0" />
            {isExpanded && <span className="mt-1">Create Course</span>}
          </Link>
        </li>
      )}

      <li>
        <Link href="/announcements"  onClick={() => setIsExpanded(false)} className="flex flex-col items-center justify-center py-3 px-5 rounded-md hover:bg-gray-700 transition-all duration-200">
          <GrAnnounce className="h-6 w-6 flex-shrink-0" />
          {isExpanded && <span className="mt-1">Announcements</span>}
        </Link>
      </li>

      <li>
        <Link href="/myclass" onClick={() => setIsExpanded(false)} className="flex flex-col items-center justify-center py-3 px-5 rounded-md hover:bg-gray-700 transition-all duration-200">
          <MdClass className="h-6 w-6 flex-shrink-0" />
          {isExpanded && <span className="mt-1">My Class</span>}
        </Link>
      </li>

      <li>
        <Link href="/myaccount" onClick={() => setIsExpanded(false)} className="flex flex-col items-center justify-center py-3 px-5 rounded-md hover:bg-gray-700 transition-all duration-200">
          <IoPersonSharp className="h-6 w-6 flex-shrink-0" />
          {isExpanded && <span className="mt-1">My Account</span>}
        </Link>
      </li>
    </ul>
  </div>

  {/* Sign Out Button */}
{/* Sign Out Button */}
{/* Sign Out Button */}
<div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
  <button
    onClick={() => signOut()}
    className="w-full flex items-center justify-center py-4 px-5 bg-gray-500 hover:bg-gray-600 rounded-md transition-all duration-200 text-lg"
  >
    {/* Mărim iconița când nu este extinsă */}
    {/* <IoExitOutline
      className={`${
        isExpanded ? "mr-2 h-4 w-4" : "mr-0 h-6 w-6"
      } transition-all`}
      style={{ fontSize: isExpanded ? "2rem" : "2.5rem" }} // aplică dimensiunea direct în stil
    /> */} 
     <span>
      <IoExitOutline></IoExitOutline>
     </span>
    <span className={`${isExpanded ? "block ml-5" : "hidden"}`}>Sign Out</span>
  </button>
</div>


</nav>


      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-auto">{children}</main>
    </div>
  );
};

export default PageBodyWrapper;
