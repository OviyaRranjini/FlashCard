import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SideWindow from '../NavBar';
import useReactions from './Reaction';

// ✅ Reaction icons
import Like from '../../assets/Like.jpg';
import Liked from '../../assets/Liked.png';
import DisLiked from '../../assets/DisLiked.png';
import DisLike from '../../assets/DisLike.png';
import Add from '../../assets/Add.png';

const Course = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId') || 'defaultUserId';

  // ✅ Custom hook for like/dislike
  const {
    likes,
    dislikes,
    userLikes,
    userDislikes,
    toggleLike,
    toggleDislike
  } = useReactions(userId);

  // ✅ Fetch all courses on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/coursesAdd');
        if (Array.isArray(res.data)) {
          setCourses(res.data);
        } else {
          console.error('Invalid course response:', res.data);
        }
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      }
    };

    fetchCourses();
  }, []);

  // ✅ Navigate to add-course page
  const addCourse = () => {
    navigate('/courseadd');
  };

  // ✅ Human-readable "time ago"
  const timeAgo = (dateStr) => {
    const now = new Date();
    const created = new Date(dateStr);
    const diff = now - created;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
    if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
  };

  return (
    <>
      <SideWindow />

      <div className="fixed right-0 left-[10%] top-[100px] h-[calc(100vh-100px)] w-[80%] p-6 rounded-2xl bg-gray-100 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Courses</h1>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-6 mt-10 pb-4">
          {courses.map((course) => {
            const courseId = course._id || course.id;

            return (
              <div
                key={courseId}
                className="rounded-2xl w-full bg-blue-200 shadow-md hover:shadow-lg cursor-pointer flex flex-col transition duration-300"
                onClick={() => navigate(`/${courseId}/${encodeURIComponent(course.name)}`)}
              >
                <img
                  src={course.image}
                  alt={course.name}
                  className="w-full h-40 rounded-t-2xl object-cover"
                />

                <div className="bg-gray-200 p-3 rounded-b-2xl flex flex-col flex-grow">
                  <p className="font-bold truncate">{course.name}</p>
                  <p className="text-sm text-gray-700 truncate">{course.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{timeAgo(course.created_at)}</p>

                  <div className="flex justify-between items-center mt-auto pt-3">
                    {/* Like Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(courseId);
                      }}
                      className="flex items-center space-x-1"
                    >
                      <img
                        src={userLikes[courseId] ? Liked : Like}
                        alt="Like"
                        className="w-6 h-6"
                      />
                      <span className="text-sm">{likes[courseId] || 0}</span>
                    </button>

                    {/* Dislike Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDislike(courseId);
                      }}
                      className="flex items-center space-x-1"
                    >
                      <img
                        src={userDislikes[courseId] ? DisLiked : DisLike}
                        alt="Dislike"
                        className="w-5 h-5"
                      />
                      <span className="text-sm">{dislikes[courseId] || 0}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ➕ Add Course Button */}
        <div
          onClick={addCourse}
          className="cursor-pointer fixed bottom-8 right-8 bg-white hover:bg-blue-200 transition-colors duration-300 rounded-full w-14 h-14 shadow-lg flex items-center justify-center"
        >
          <img src={Add} alt="Add" className="w-8 h-8" />
        </div>
      </div>
    </>
  );
};

export default Course;
