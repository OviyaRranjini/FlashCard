import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CoursesProgress = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  const userId = sessionStorage.getItem('userId') || 'defaultUserId';
  const userName = sessionStorage.getItem('userName') || 'defaultUsername';

  useEffect(() => {
  const fetchCourses = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/coursesAdd/UserCreated', {
        method: 'GET',
        credentials: 'include', // must include this for cookies
      });

      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      } else {
        console.warn('Failed to fetch courses:', res.status);
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  fetchCourses();
}, []);



  const timeAgo = (dateStr) => {
    const now = new Date();
    const created = new Date(dateStr);
    const diff = now - created;
    const units = [
      { label: 'year', millis: 365 * 24 * 60 * 60 * 1000 },
      { label: 'month', millis: 30 * 24 * 60 * 60 * 1000 },
      { label: 'day', millis: 24 * 60 * 60 * 1000 },
      { label: 'hour', millis: 60 * 60 * 1000 },
      { label: 'minute', millis: 60 * 1000 },
      { label: 'second', millis: 1000 },
    ];
    for (const unit of units) {
      const value = Math.floor(diff / unit.millis);
      if (value > 0) return `${value} ${unit.label}${value > 1 ? 's' : ''} ago`;
    }
    return 'just now';
  };

  const goToContentAdd = (id, name) => {
    navigate(`/contentadd/${id}/${encodeURIComponent(userName)}/${encodeURIComponent(name)}`);
  };

  const handleDeleteClick = (e, courseId) => {
    e.stopPropagation();
    const confirmed = window.confirm('Are you sure you want to delete this course?');
    if (confirmed) {
      confirmDelete(courseId);
    }
  };

  const confirmDelete = async (courseId) => {
  try {
    await axios.delete(`http://localhost:5000/api/coursesAdd/${courseId}`, {
      withCredentials: true, // 🔐 This is the fix!
    });
    setCourses(prevCourses =>
      prevCourses.filter(course => (course._id || course.id) !== courseId)
    );
  } catch (error) {
    console.error("Error deleting course:", error);
    alert("Failed to delete course.");
  }
};


  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Courses You Created</h2>
      {courses.length === 0 ? (
        <p className="text-gray-500 text-center py-8 italic">No courses created yet. Start building one!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map(course => {
            const id = course._id || course.id;
            const image = course.image;

            return (
              <div
                key={id}
                className="bg-white rounded-xl shadow hover:shadow-lg cursor-pointer transition overflow-hidden relative flex flex-col"
              >
                <div onClick={() => goToContentAdd(id, course.name)} className="flex-grow">
                  <img src={image} alt={course.name} className="w-full h-40 object-cover" />
                  <div className="p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-base truncate pr-2">{course.name}</h3>
                      <div className="flex space-x-1">
                        <button
                          onClick={(e) => handleDeleteClick(e, course.id)}
                          className="p-1 rounded-full text-red-500 hover:bg-red-100 transition-colors"
                          title="Delete course"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{course.description || 'No description'}</p>
                    <p className="text-xs text-gray-400 mt-1">{timeAgo(course.created_at)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CoursesProgress;
