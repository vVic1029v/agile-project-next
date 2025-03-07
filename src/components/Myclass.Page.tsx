"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { motion } from "framer-motion";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  
}

interface FacultyMember {
  id: string;
  user: User;
}

interface Student {
  id: string;
  user: User;
}

interface HomeClass {
  id: string;
  name: string;
  homeroomFacultyMember: FacultyMember;
  students: Student[];
  facultyMembers: FacultyMember[];
  profileImage?: string;
  homeClassId: string;
}

export default function ClassProfile() {
  const { data: session } = useSession();
  const [homeClass, setHomeClass] = useState<HomeClass | null>(null);
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchClassData() {
      const res = await fetch(`/api/class/${homeClass}`);
      const data = await res.json();
      setHomeClass(data);
    }
    fetchClassData();
  }, [homeClass]);

  async function handleImageUpload() {
    if (!newImage || !homeClass) return;
    setLoading(true);
    
    const formData = new FormData();
    formData.append("file", newImage);

    const res = await fetch(`/api/class/${homeClass}/uploadImage`, {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      setHomeClass((prev) => prev ? { ...prev, profileImage: data.imageUrl } : null);
    }

    setIsEditingImage(false);
    setLoading(false);
  }

  if (!homeClass) return <p>Loading...</p>;

  const isTeacher = session?.user?.id === homeClass.homeroomFacultyMember.id;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
      <div className="flex items-center space-x-4">
        <motion.div whileHover={{ scale: 1.05 }}>
          {homeClass.profileImage ? (
            <Image
              src={homeClass.profileImage}
              alt="Class Profile"
              width={100}
              height={100}
              className="rounded-full"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center text-gray-700">
              No Image
            </div>
          )}
        </motion.div>
        {isTeacher && (
          <button
            className="px-3 py-1 bg-blue-600 text-white rounded-md"
            onClick={() => setIsEditingImage(true)}
          >
            Change Image
          </button>
        )}
      </div>

      {isEditingImage && (
        <div className="mt-2">
          <input type="file" onChange={(e) => setNewImage(e.target.files?.[0] || null)} />
          <button className="mt-2 px-3 py-1 bg-green-600 text-white rounded-md" onClick={handleImageUpload} disabled={loading}>
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      )}

      <h1 className="text-2xl font-bold mt-4">{homeClass.name}</h1>
      <p className="text-gray-700">
        <strong>Homeroom Teacher:</strong> {homeClass.homeroomFacultyMember.user.firstName} {homeClass.homeroomFacultyMember.user.lastName} - 
        <a href={`mailto:${homeClass.homeroomFacultyMember.user.email}`} className="text-blue-600"> {homeClass.homeroomFacultyMember.user.email}</a>
      </p>

      <h2 className="text-xl font-semibold mt-4">Professors</h2>
      <ul className="list-disc ml-5">
        {homeClass.facultyMembers.map((prof) => (
          <li key={prof.id} className="text-gray-700">
            {prof.user.firstName} {prof.user.lastName} - 
            <a href={`mailto:${prof.user.email}`} className="text-blue-600"> {prof.user.email}</a>
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mt-4">Students</h2>
      <ul className="list-disc ml-5">
        {homeClass.students.map((student) => (
          <li key={student.id} className="text-gray-700">
            {student.user.firstName} {student.user.lastName} - 
            <a href={`mailto:${student.user.email}`} className="text-blue-600"> {student.user.email}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
