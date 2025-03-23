// src/app/(pages)/ClassProfile.tsx
"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getClassProfile } from "@/lib/actions";
import { motion } from "framer-motion";

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

export default async function ClassProfile() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-red-600">Not authenticated</p>
      </div>
    );
  }

  let homeClass: HomeClass | null = null;
  try {
    homeClass = await getClassProfile(session.user.id);
    console.log("🔍 Faculty Members:", homeClass.facultyMembers);
  } catch (error) {
    console.error("❌ Error fetching home class details:", error);
  }

  if (!homeClass) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-700">No class data found.</p>
      </div>
    );
  }

  return (
    <div
      className="bg-gradient-to-br from-white via-blue-50 to-blue-300 min-h-screen flex items-center justify-center p-4"
 
    >
      <div className="p-6 bg-white rounded-3xl shadow-md max-w-3xl mx-auto w-full space-y-6"
           >
        <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600 mb-8 text-center">
          {homeClass.className}
        </h1>

        <p className="text-gray-700 mb-4 text-lg">
          <strong>Homeroom Teacher:</strong> {homeClass.homeroomTeacher.name}{" "}
          <a
            href={`mailto:${homeClass.homeroomTeacher.email}`}
            className="text-blue-600 underline"
          >
            ({homeClass.homeroomTeacher.email})
          </a>
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">Professors</h2>
        {homeClass.facultyMembers.length === 0 ? (
          <p className="text-gray-600">No professors assigned.</p>
        ) : (
          <ul className="list-disc ml-6 space-y-4">
            {homeClass.facultyMembers.map((prof, index) => (
              <li key={index} className="text-gray-700">
                <div>
                  <span className="font-medium text-lg">{prof.name}</span> -{" "}
                  <a
                    href={`mailto:${prof.email}`}
                    className="text-blue-600 underline"
                  >
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

        <h2 className="text-2xl font-semibold mt-6 mb-3">Students</h2>
        {homeClass.students.length === 0 ? (
          <p className="text-gray-600">No students assigned.</p>
        ) : (
          <ul className="list-disc ml-6 space-y-4">
            {homeClass.students.map((student, index) => (
              <li key={index} className="text-gray-700">
                <div>
                  <span className="font-medium text-lg">{student.name}</span> -{" "}
                  <a
                    href={`mailto:${student.email}`}
                    className="text-blue-600 underline"
                  >
                    {student.email}
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
