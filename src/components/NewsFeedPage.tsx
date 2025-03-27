"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import MainButton from "./Common/Buttons/MainButton";
import { createNews, getAllNews,getAuthorNameById  } from "@/lib/actions";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  date: string | Date;
  authorId: string;
}

const NewsFeed: React.FC = () => {
  const { data: session } = useSession();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authorNames, setAuthorNames] = useState<{ [key: string]: string }>({});
  // Modificăm tipul pentru image ca să poată fi File sau null
  const [newNews, setNewNews] = useState<{ title: string; content: string; image: File | null }>({
    title: "",
    content: "",
    image: null,
  });

  const [preview, setPreview] = useState<string | null>(null);

  // Fetch all news when component mounts
  useEffect(() => {
    const fetchNews = async () => {
      const fetchedNews = await getAllNews();
      const newsWithStringDate = fetchedNews.map((newsItem) => ({
        ...newsItem,
        date: newsItem.date instanceof Date ? newsItem.date.toISOString() : newsItem.date,
      }));
      const authorNamesMap: { [key: string]: string } = {};
      for (const newsItem of fetchedNews) {
        const authorName = await getAuthorNameById(newsItem.authorId);  // Obținem numele autorului
        authorNamesMap[newsItem.authorId] = authorName || "Unknown";
      }
      setAuthorNames(authorNamesMap); 
      setNews(newsWithStringDate);
    };
    fetchNews();
  }, []);

  const openDetailsModal = (newsItem: NewsItem) => {
    setSelectedNews(newsItem);
  };

  const closeDetailsModal = () => {
    setSelectedNews(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Setăm imaginea și previzualizarea
      setNewNews((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!session?.user) return;
  
    const formData = new FormData();
    formData.append("title", newNews.title);
    formData.append("content", newNews.content);
    formData.append("userId", session.user.id);
    if (newNews.image) formData.append("file", newNews.image); // Adăugăm fișierul în FormData
  
    // Trimitem fișierul la API-ul backend
    const response = await fetch("/api/upload-profile-image", {
      method: "POST",
      body: formData,
    });
  
    const data = await response.json();
  
    if (response.ok) {
      // Dacă încărcarea fișierului a fost cu succes, obținem URL-ul imaginii
      const imageUrl = data.imageUrl;
  
      // Creăm anunțul folosind URL-ul imaginii
      const createdNews = await createNews({
        title: newNews.title,
        content: newNews.content,
        imageUrl, // Folosim URL-ul imaginii obținut de la Cloudinary
        authorId: session.user.id,
        date: new Date().toISOString(), // Date convertit în string
      });
  
      setNews([createdNews, ...news]);
      setIsModalOpen(false);
      setNewNews({ title: "", content: "", image: null });
      setPreview(null);
    } else {
      console.error("Error uploading image:", data.error);
    }
  };
  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="items-center flex flex-col w-full max-w-4xl" >
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: .6 }}
        className="text-4xl font-bold text-neutral-100"
      >
        News feed
      </motion.h1>

      {session?.user.userType === "FACULTYMEMBER" && (
        <button
          className="bg-neutral-100 text-neutral-900 p-2 rounded-lg mt-4 flex items-center gap-2 hover:bg-neutral-200"
          onClick={() => setIsModalOpen(true)}
        >
          Add News +
        </button>
      )}
      </div>
   

      <motion.div
        className="w-full max-w-4xl space-y-6 mt-6"
  
      >
        {news.map((newsItem) => (
          <motion.div
          initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
            key={newsItem.id}
            onClick={() => openDetailsModal(newsItem)}
            className="bg-neutral-100 p-6 rounded-lg shadow-lg cursor-pointer"
            whileHover={{ scale: 1.02 }}
          >
            <h2 className="text-3xl font-semibold mb-5 ">{newsItem.title}</h2>
            <p className="mb-5 text-lg text-neutral-900">{newsItem.content}</p>
            <p className="text-lg text-neutral-700">Author: {authorNames[newsItem.authorId] || "Unknown"}</p>
            <p className="text-lg text-neutral-700">Date: {new Date(newsItem.date).toLocaleString()}</p>
            {newsItem.imageUrl && (
  <img
    src={newsItem.imageUrl}
    alt="news"
    className="mt-2 rounded-lg max-w-[80%] mx-auto object-contain mt-9" // Lățime maximă 80%, centrată, fără a distorsiona imaginea
  />
)}
            
            {/* Nume autor și data cu stiluri ajustate */}
            
          </motion.div>
        ))}
      </motion.div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-neutral-900 bg-opacity-50">
          <div className="bg-neutral-50 p-8 rounded-lg w-96 shadow-xl">
            <h2 className="text-2xl font-semibold">Add news</h2>
            <input
              type="text"
              placeholder="Title"
              className="w-full p-2 border rounded mt-2"
              value={newNews.title}
              onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
            />
            <textarea
              placeholder="Content"
              className="w-full p-2 border rounded mt-2"
              value={newNews.content}
              onChange={(e) => setNewNews({ ...newNews, content: e.target.value })}
            />

            <div className="mt-5 w-full mb-7">
              <input
                type="file"
                id="file-input"
                className="hidden mt-5"
                onChange={handleFileChange}
              />
              <label
                htmlFor="file-input"
                className="bg-neutral-800 text-neutral-50 p-3 rounded-lg cursor-pointer w-full mt-4 mb-4 text-center shadow-md hover:bg-neutral-700 transition duration-300 "
              >
                Choose Picture
              </label>
            </div>

            {preview && (
  <div className="mt-4 w-full flex justify-center">
    <img
      src={preview}
      alt="preview"
      className="rounded-lg shadow-lg w-auto max-w-full max-h-80 object-contain"  // Ajustează aici pentru a controla dimensiunea imaginii
    />
  </div>
)}

            <button
              onClick={handleSubmit}
              className="bg-neutral-800 text-white p-2 rounded-lg w-full mt-4"
            >
              Submit
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-500 text-white p-2 rounded-lg w-full mt-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsFeed;
