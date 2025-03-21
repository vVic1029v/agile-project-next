"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { UserType } from "@prisma/client";
import MainButton from "./Common/Buttons/MainButton";
import { getAnnouncements, newAnnouncement } from "@/lib/actions";

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
  const [newAnnouncementData, setNewAnnouncementData] = useState({
    title: "",
    content: "",
    date: "",
    allUsers: false,
    homeClassIds: [] as string[],
  });

  useEffect(() => {
    if (!session?.user) return;
  
    const fetchAnnouncements = async () => {
      try {
        const result = await getAnnouncements(session.user.id); // Use getAnnouncements from actions.ts
        const data: Announcement[] = result?.announcements.map((announcement) => ({
          ...announcement,
          homeClasses: announcement.homeClasses || [], // Default to an empty array
        })) || []; // Default to an empty array if undefined
  
        if (session.user.userType === "FACULTYMEMBER") {
          setIsFacultyMember(true);
          setAnnouncements(data);
        } else if (session.user.userType === "STUDENT") {
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
  
    fetchAnnouncements(); // Call the function inside useEffect
  }, [session]); // Add session as a dependency// Add session as a dependency

  useEffect(() => {
    const fetchHomeClasses = async () => {
      try {
        const res = await fetch("/api/searchHomeClasses");
        
        if (!res.ok) throw new Error("Failed to fetch home classes");
  
        const data: HomeClass[] = await res.json();
        
        setHomeClasses(data);
      } catch (error) {
        console.error("Error fetching home classes:", error);
      }
    };
  
    fetchHomeClasses();
  }, []);

  const openDetailsModal = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
  };

  const closeDetailsModal = () => {
    setSelectedAnnouncement(null);
  };

  const handleSubmitAnnouncement = async () => {
    if (!newAnnouncementData.title || !newAnnouncementData.content || !newAnnouncementData.date) {
      alert("All fields are required!");
      return;
    }
  
    try {
      const formData = new FormData();
      formData.set("title", newAnnouncementData.title);
      formData.set("content", newAnnouncementData.content);
      formData.set("date", newAnnouncementData.date);
      formData.set("allUsers", newAnnouncementData.allUsers.toString());
      if (!newAnnouncementData.allUsers) {
        formData.set("homeClassIds", JSON.stringify(newAnnouncementData.homeClassIds));
      }
  
      const result = await newAnnouncement(formData); // Use newAnnouncement from actions.ts
      const createdAnnouncement = result.newAnnouncement;
  
      // Ensure homeClasses is always included
      const announcementWithDefaults: Announcement = {
        ...createdAnnouncement,
        date: createdAnnouncement.date.toISOString(), // Convert Date to string
        homeClasses: createdAnnouncement.homeClasses || [], // Default to an empty array
      };
  
      setAnnouncements((prev) => [...prev, announcementWithDefaults]);
      setShowModal(false);
      setNewAnnouncementData({ title: "", content: "", date: "", allUsers: false, homeClassIds: [] });
    } catch (error) {
      console.error("Error creating announcement:", error);
      alert("Failed to create announcement");
    }
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-EN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-blue-50 to-blue-300">
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-4xl font-bold text-cyan-600"
      >
        Announcements
      </motion.h1>
      {isFacultyMember && (
        <MainButton onClick={() => setShowModal(true)}>Add Announcement</MainButton>
      )}

      <motion.div
        className="w-full max-w-4xl space-y-6 mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {announcements.map((announcement, index) => (
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
      </motion.div>

      {showModal && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-white p-8 rounded-lg w-96 shadow-xl">
            <h2 className="text-2xl font-semibold">Add New Announcement</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                placeholder="Title"
                value={newAnnouncementData.title}
                onChange={(e) =>setNewAnnouncementData({ ...newAnnouncementData, title: e.target.value })}
                className="w-full p-2 border rounded-lg mt-2"
              />

              <textarea
                placeholder="Content"
                value={newAnnouncementData.content}
                onChange={(e) => setNewAnnouncementData({ ...newAnnouncementData, content: e.target.value })}
                className="w-full p-2 border rounded-lg mt-2"
              />

              <input
                type="checkbox"
                checked={newAnnouncementData.allUsers}
                onChange={(e) => setNewAnnouncementData({ ...newAnnouncementData, allUsers: e.target.checked })}
                className="mt-2"
              />
              <label className="ml-2">Apply to all users</label>

              {!newAnnouncementData.allUsers && (
                <select
                  multiple
                  value={newAnnouncementData.homeClassIds}
                  onChange={(e) =>
                    setNewAnnouncementData({
                      ...newAnnouncementData,
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
                value={newAnnouncementData.date}
                onChange={(e) => setNewAnnouncementData({ ...newAnnouncementData, date: e.target.value })}
                className="w-full p-2 border rounded-lg mt-2"
              />

              <button onClick={handleSubmitAnnouncement} className="bg-cyan-600 text-white p-3 rounded-lg w-full mt-4">
                Submit
              </button>
            </form>

            <button onClick={() => setShowModal(false)} className="bg-gray-500 text-white p-2 rounded-lg w-full mt-4">
              Close
            </button>
          </div>
        </motion.div>
      )}

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