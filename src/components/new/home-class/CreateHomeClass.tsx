'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MainButton from '../../Common/Buttons/MainButton';
import { NewHomeClass } from '@/lib/actions';

const CreateHomeClass = () => {
  const [teacherEmail, setTeacherEmail] = useState('');
  const [startYear, setStartYear] = useState('');
  const [nameLetter, setNameLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {

      const formData = new FormData();
      formData.set('teacherEmail', teacherEmail);
      formData.set('startYear', startYear);
      formData.set('nameLetter', nameLetter);
      const results = await NewHomeClass(formData);
      
  
      setMessage({ type: 'success', text: 'Home class created successfully!' });
      setTeacherEmail('');
      setStartYear('');
      setNameLetter('');
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-300 p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mt-6 w-96 space-y-4">
          <motion.div
            className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600 text-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Create Home Class
          </motion.div>

          <div>
            <label htmlFor="teacherEmail" className="block text-sm font-medium text-gray-700">Teacher Email</label>
            <input
              type="email"
              placeholder="Teacher Email"
              value={teacherEmail}
              onChange={(e) => setTeacherEmail(e.target.value)}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label htmlFor="startYear" className="block text-sm font-medium text-gray-700">Start Year</label>
            <input
              type="number"
              placeholder="Choose start year"
              value={startYear}
              onChange={(e) => setStartYear(e.target.value)}
              required
              min="2000"
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label htmlFor="nameLetter" className="block text-sm font-medium text-gray-700">Class Name (Number & Letter)</label>
            <input
              type="text"
              placeholder="Set class name"
              value={nameLetter}
              onChange={(e) => setNameLetter(e.target.value.toUpperCase())}
              required
              maxLength={5}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition"
          >
            {loading ? 'Creating...' : 'Create Class'}
          </button>

          {message && (
            <p className={`text-center mt-2 ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {message.text}
            </p>
          )}
        </form>
      </motion.div>
    </div>
  );
};

export default CreateHomeClass;
