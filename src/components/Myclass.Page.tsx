import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { data } from "framer-motion/client";
import {getHomeClassDetails} from "@/lib/actions";
interface Person {
  name: string;
  email: string;
}

interface FacultyMember extends Person {
  subject?: string;
}

interface HomeClass {
  className: string;
  homeroomTeacher: Person;
  students: Person[];
  facultyMembers: FacultyMember[];
}

export default function ClassProfile() {
  const { data: session } = useSession();
  const [homeClass, setHomeClass] = useState<HomeClass | null>(null);

  useEffect(() => {
    async function fetchClassData() {
      if (!session?.user?.id) {
        console.warn("❌ No user ID found in session");
        return;
      }
  
      try {
        const homeClassDetails = await getHomeClassDetails(session.user.id);
        if (!homeClassDetails) {
          // console.error("❌ Failed to fetch home class details");
          return;
        }
        setHomeClass({
          className: homeClassDetails.name,
          homeroomTeacher: homeClassDetails.homeroomFacultyMember,
          students: homeClassDetails.students,
          facultyMembers: homeClassDetails.facultyMembers,
        });
      } catch (error) {
        console.error("❌ Error fetching home class details:", error);
      }
    }
  
    fetchClassData();
  }, [session?.user?.id]);
  

  if (!homeClass) return (
    <div className="bg-gradient-to-br from-white via-blue-50 to-blue-300 min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center justify-center space-y-4"
      >
        <svg
          className="animate-spin h-12 w-12 text-cyan-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
        
      </motion.div>
    </div>
  );

  return (
    <div className=" bg-gradient-to-br from-white via-blue-50 to-blue-300 min-h-screen flex items-center justify-center p-4">
  <div className="p-6 bg-white rounded-3xl shadow-md max-w-3xl mx-auto w-full space-y-6 ">
      {/* class name */}
      <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600 mb-8 text-center"
            >
               {homeClass.className}
            </motion.h1>

      {/* diriginte */}
      <p className="text-gray-700 mb-4 text-lg">
        <strong>Homeroom Teacher:</strong>{" "}
        {homeClass.homeroomTeacher.name}{" "}
        <a href={`mailto:${homeClass.homeroomTeacher.email}`} className="text-blue-600 underline">
          ({homeClass.homeroomTeacher.email})
        </a>
      </p>

      {/* Profi*/}
      <h2 className="text-2xl font-semibold mt-6 mb-3">Professors</h2>
{homeClass.facultyMembers.length === 0 ? (
  <p className="text-gray-600">No professors assigned.</p>
) : (
  <ul className="list-disc ml-6 space-y-4">
    {homeClass.facultyMembers.map((prof, index) => (
      <li key={index} className="text-gray-700">
        <div>
          <span className="font-medium text-lg">{prof.name}</span> -{" "}
          <a href={`mailto:${prof.email}`} className="text-blue-600 underline">
            {prof.email}
          </a>
        </div>
        {prof.subject && (
          <span className="inline-block mt-1 bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
            {prof.subject}
          </span>
        )}
      </li>
    ))}
  </ul>
)}


      {/* Studentii */}
      <h2 className="text-2xl font-semibold mt-6 mb-3">Students</h2>
      {homeClass.students.length === 0 ? (
        <p className="text-gray-600">No students assigned.</p>
      ) : (
        <ul className="list-disc ml-6 space-y-2">
          {homeClass.students.map((student, index) => (
            <li key={index} className="text-gray-700">
              <span className="font-medium">{student.name}</span> -{" "}
              <a href={`mailto:${student.email}`} className="text-blue-600 underline">
                {student.email}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>

    </div>
  
  );
}
function HomeClassDetails(userId: string) {
  throw new Error("Function not implemented.");
}

