"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { UserType } from "@prisma/client";


interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  allUsers: boolean;
  homeClasses: { id: string; name: string }[];
}


interface HomeClass {
  id: string;
  name: string;
}

const AnnouncementsPage: React.FC = () => {
  const { data: session } = useSession();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [homeClasses, setHomeClasses] = useState<HomeClass[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isFacultyMember, setIsFacultyMember] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    date: "",
    allUsers: false,
    homeClassIds: [] as string[],
  });

  // Fetch pentru anunțuri și clase
 
  useEffect(() => {
    if (!session?.user) return;
  
    const fetchAnnouncements = async () => {
      try {
        const res = await fetch("/api/announcements");
        const data: Announcement[] = await res.json();
  
        if (session.user.userType === "FACULTYMEMBER") {
          setIsFacultyMember(true);
          setAnnouncements(data); 
        } else if (session.user.userType=== "STUDENT") {
          const studentClassId = session.user.homeClassId; 
          setIsFacultyMember(false);
          const filteredAnnouncements = data.filter(
            (announcement) =>
              announcement.allUsers || 
              announcement.homeClasses.some((cls) => cls.id === studentClassId) 
          );
          setAnnouncements(filteredAnnouncements);
        }
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };
  
    fetchAnnouncements();
  }, [session]);

  // Deschide detaliile unui anunț
  const openDetailsModal = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
  };

  // Închide modalul de detalii
  const closeDetailsModal = () => {
    setSelectedAnnouncement(null);
  };

  // Trimitere anunț nou
  const handleSubmitAnnouncement = async () => {
    if (!newAnnouncement.title || !newAnnouncement.content || !newAnnouncement.date) {
      alert("All fields are required!");
      return;
    }

    const response = await fetch("/api/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAnnouncement),
    });

    if (response.ok) {
      const createdAnnouncement: Announcement = await response.json();
      setAnnouncements((prev) => [...prev, createdAnnouncement]); // corectat
      setShowModal(false);
      setNewAnnouncement({ title: "", content: "", date: "", allUsers: false, homeClassIds: [] });
    } else {
      alert("Failed to create announcement");
    }
  };

  // Funcție pentru a formata data și ora
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-EN", {
      weekday: "long", // Luni, marți, etc.
      year: "numeric",
      month: "long",  // Ianuarie, Februarie, etc.
      day: "numeric",
      hour: "2-digit", // Ora
      minute: "2-digit", // Minute
    }).format(date);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-blue-50 to-blue-300">
      <motion.h1 
       initial={{ opacity: 0 }}
       animate={{ opacity: 1 }}
       transition={{ duration: 1 }}
      className="text-4xl font-bold text-cyan-600">Announcements</motion.h1>
       {isFacultyMember && (   <button onClick={() => setShowModal(true)} className="bg-cyan-600 text-white p-3 rounded-lg mt-4">
        Add Announcement
      </button>)}
   

      <motion.div
        className="w-full max-w-4xl space-y-6 mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
      {/* Lista anunțurilor */}
      <div className="w-full max-w-4xl space-y-6 mt-6">
        {announcements.map((announcement,index) => (
          <motion.div
          key={announcement.id}
          onClick={() => openDetailsModal(announcement)}
          className="bg-white p-6 rounded-lg shadow-lg cursor-pointer"
          whileHover={{ scale: 1.02 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
        >
            <h2 className="text-2xl font-semibold">{announcement.title}</h2>
            <p>{announcement.content}</p>
            <p className="text-sm text-gray-500">
              {announcement.allUsers
                ? "For All Users"
                : `Class: ${announcement.homeClasses?.map((cls) => cls.name).join(", ") || "N/A"}`}{" "}
              | Date: {formatDate(announcement.date)}
            </p>
            </motion.div>
        ))}
      </div>
      </motion.div>

      {/* Modal pentru adăugare anunț nou */}
      {showModal && (
         <motion.div
          className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg w-96 shadow-xl">
            <h2 className="text-2xl font-semibold">Add New Announcement</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                placeholder="Title"
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                className="w-full p-2 border rounded-lg mt-2"
              />

              <textarea
                placeholder="Content"
                value={newAnnouncement.content}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                className="w-full p-2 border rounded-lg mt-2"
              />

              <input
                type="checkbox"
                checked={newAnnouncement.allUsers}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, allUsers: e.target.checked })}
                className="mt-2"
              />
              <label className="ml-2">Apply to all users</label>

              {!newAnnouncement.allUsers && (
                <select
                  multiple
                  value={newAnnouncement.homeClassIds}
                  onChange={(e) =>
                    setNewAnnouncement({
                      ...newAnnouncement,
                      homeClassIds: Array.from(e.target.selectedOptions, (option) => option.value),
                    })
                  }
                  className="w-full p-2 border rounded-lg mt-2"
                >
                  {homeClasses.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              )}

              <input
                type="datetime-local"
                value={newAnnouncement.date}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, date: e.target.value })}
                className="w-full p-2 border rounded-lg mt-2"
              />

              <button onClick={handleSubmitAnnouncement} className="bg-cyan-600 text-white p-3 rounded-lg w-full mt-4">
                Submit
              </button>
            </form>

            {/* Buton de închidere a modalului */}
           <button
              onClick={() => setShowModal(false)}
              className="bg-gray-500 text-white p-2 rounded-lg w-full mt-4"
            >
              Close
            </button>
           
          </div>
          
        </div>
        </motion.div>
      )}

      {/* Modal pentru detalii anunț */}
      {selectedAnnouncement && (
         <motion.div
         className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
       >
      
        <motion.div
            className="bg-white p-8 rounded-lg w-96 shadow-xl"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <h2 className="text-2xl font-semibold">{selectedAnnouncement.title}</h2>
            <p>{selectedAnnouncement.content}</p>
            <p className="text-sm text-gray-500">
              {selectedAnnouncement.allUsers
                ? "For All Users"
                : `Class: ${selectedAnnouncement.homeClasses?.map((cls) => cls.name).join(", ") || "N/A"}`}{" "}
              | Date: {formatDate(selectedAnnouncement.date)}
            </p>
            
            <button onClick={closeDetailsModal} className="bg-gray-500 text-white p-2 rounded-lg w-full mt-4">
              Close
            </button>
         
        </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AnnouncementsPage;
