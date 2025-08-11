import React, { useState } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const CourseAdd = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
  // e.preventDefault();

  const formData = new FormData();
  formData.append('name', name);
  formData.append('description', description);
  formData.append('thumbnail', thumbnail);

  try {
    await axios.post('http://localhost:5000/api/coursesAdd/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true, // ⬅️ Required to include session cookie
    });

    alert('Course added successfully!');
    navigate('/progress');
  } catch (error) {
    console.error('Error uploading course:', error);

    alert(`Failed to upload course. ${error.response?.data?.error || ''}`);
  }
};


  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
      <div className="p-8 w-full max-w-xl bg-white rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-bold mb-6 text-center">Add New Course</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Course Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 border rounded-xl"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Course Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full p-3 border rounded-xl"
              rows={4}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Thumbnail</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnail(e.target.files[0])}
              required
              className="w-full p-2 border rounded-xl"
            />
          </div>
          <p
              onClick={handleSubmit}
            className="w-full text-center bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition cursor-pointer"
             >
              Add Course
            </p>

        </form>
      </div>
    </div>
  );
};

export default CourseAdd;
