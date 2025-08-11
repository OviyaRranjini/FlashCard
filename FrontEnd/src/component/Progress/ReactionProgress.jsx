import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ReactionProgress = () => {
  const [courses, setCourses] = useState([]);
  const [reactions, setReactions] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // ✅ 1. Get logged-in user from session (cookie)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/me', {
          credentials: 'include', // 👈 Needed to send cookies
        });
        if (!res.ok) throw new Error('Not authenticated');
        const userData = await res.json();
        setCurrentUser(userData);
      } catch (err) {
        console.error('User session error:', err);
        navigate('/signin'); // Redirect to login if not authenticated
      }
    };

    fetchUser();
  }, [navigate]);

  // ✅ 2. Fetch all courses
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/coursesAdd')
      .then((res) => {
        if (Array.isArray(res.data)) {
          setCourses(res.data);
        } else {
          console.error('Unexpected courses format');
          setError('Invalid course data');
        }
      })
      .catch((err) => {
        console.error('Course load error', err);
        setError('Failed to load courses');
      });
  }, []);

  // ✅ 3. Fetch user reactions based on session
  useEffect(() => {
    if (!currentUser) return;

    axios
      .get('http://localhost:5000/api/reactions', {
        withCredentials: true, // 👈 Required for cookie-based session
      })
      .then((res) => {
        setReactions(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Reactions fetch error', err);
        setError('Failed to load reactions');
        setLoading(false);
      });
  }, [currentUser]);

  // ⏱️ Helper to show "x time ago"
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

  // 🧠 Create a lookup of course_id → reaction type
  const reactionMap = reactions.reduce((map, r) => {
    map[r.course_id] = r.type;
    return map;
  }, {});

  // 🎯 Filter courses that were reacted to
  const reacted = courses.filter((c) => reactionMap[c._id || c.id]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Courses You Reacted To</h2>

      {loading ? (
        <p className="text-gray-500 text-center py-8 italic">Loading...</p>
      ) : error ? (
        <p className="text-red-600 text-center py-8">{error}</p>
      ) : reacted.length === 0 ? (
        <p className="text-gray-500 text-center py-8 italic">React to show your support!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {reacted.map((course) => {
            const id = course._id || course.id;
            const type = reactionMap[id];
            const image = course.image || '/placeholder.jpg';

            return (
              <div
                key={id}
                onClick={() => navigate(`/${id}/${encodeURIComponent(course.name)}`)}
                className="bg-white rounded-xl shadow hover:shadow-lg cursor-pointer transition overflow-hidden"
              >
                <img
                  src={image}
                  alt={course.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4 bg-gray-50">
                  <h3 className="font-semibold text-base truncate">{course.name}</h3>
                  <p className="text-sm text-gray-600 truncate">
                    {course.description || 'No description'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {timeAgo(course.created_at)}
                  </p>
                  <p
                    className={`mt-2 text-sm font-medium ${
                      type === 'like' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {type === 'like' ? '👍 Liked' : '👎 Disliked'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReactionProgress;
