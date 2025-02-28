"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { motion } from 'framer-motion'; 

const AnnouncementsPage: React.FC = () => {
  const { data: session } = useSession();
  const [announcements, setAnnouncements] = useState<Array<{ title: string; content: string; class: string; date: string }>>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<{ title: string; content: string; class: string; date: string } | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState<{ title: string; content: string; class: string; date: string }>({ title: "", content: "", class: "", date: "" });

  // Simulare anunțuri
  useEffect(() => {
    setAnnouncements([
      { title: "Important Update", content: "Today the math class is suspended.", class: "11 A", date: "2025-03-01" },
      { title: "National exam", content: "The national exam is recheduled on next week", class: "12 D", date: "2025-03-05" },
      { title: "Holiday Notice", content: "The french circle will be closed on national holidays.", class: "9 A", date: "2025-03-10" }
    ]);
  }, []);

  const openDetailsModal = (announcement: { title: string; content: string; class: string; date: string }) => {
    setSelectedAnnouncement(announcement);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedAnnouncement(null);
  };

  const handleSubmitAnnouncement = () => {
    setAnnouncements([...announcements, { title: "New Announcement", content: "This is a test announcement.", class: "Test", date: "2025-03-12" }]);
    setShowModal(false);  
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-blue-50 to-blue-300">
      <motion.h1
        className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600 mb-8"
        initial={{ opacity: 0, y: 50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }} 
      >
        Announcements
      </motion.h1>

      <motion.button
        onClick={() => setShowModal(true)}
        className="mb-6 px-6 py-3 text-white bg-cyan-600 rounded-xl shadow-md hover:bg-cyan-700 transition duration-300 transform hover:scale-105"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }}
      >
        Add Announcement
      </motion.button>

     
      <motion.div
        className="w-full max-w-4xl space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {announcements.map((announcement, index) => (
          <motion.div
            key={index}
            onClick={() => openDetailsModal(announcement)}
            className="bg-white p-6 rounded-xl shadow-lg hover:scale-105 transform transition duration-300 cursor-pointer"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }} 
          >
            <h2 className="text-2xl font-semibold text-gray-800">{announcement.title}</h2>
            <p className="text-gray-600 mt-2">{announcement.content}</p>
            <p className="text-gray-500 text-sm mt-4">Class: {announcement.class} | Date: {announcement.date}</p>
          </motion.div>
        ))}
      </motion.div>

      {showDetailsModal && selectedAnnouncement && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 transition-opacity duration-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="bg-white p-8 rounded-xl w-96 shadow-xl transform transition-all duration-300 scale-95 hover:scale-100"
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{selectedAnnouncement.title}</h2>
            <p className="text-gray-600">{selectedAnnouncement.content}</p>
            <p className="text-gray-500 text-sm mt-4">Class: {selectedAnnouncement.class}</p>
            <p className="text-gray-500 text-sm">Date: {selectedAnnouncement.date}</p>
            <div className="flex justify-between mt-6">
              <button
                onClick={closeDetailsModal}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {showModal && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="bg-white p-8 rounded-xl w-96 shadow-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add New Announcement</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  id="title"
                  type="text"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
                <textarea
                  id="content"
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                  rows={4}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="class" className="block text-sm font-medium text-gray-700">Class</label>
                <input
                  id="class"
                  type="text"
                  value={newAnnouncement.class}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, class: e.target.value })}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  id="date"
                  type="date"
                  value={newAnnouncement.date}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, date: e.target.value })}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex justify-between">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitAnnouncement}
                  className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AnnouncementsPage;
