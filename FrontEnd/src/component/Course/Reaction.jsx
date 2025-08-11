import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/reactions';
const COURSES_API = 'http://localhost:5000/api/coursesAdd';

const useReactions = () => {
  const [likes, setLikes] = useState({});
  const [dislikes, setDislikes] = useState({});
  const [userLikes, setUserLikes] = useState({});
  const [userDislikes, setUserDislikes] = useState({});
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/me', {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Not authenticated');
        const data = await res.json();
        setUserId(data.id);
        fetchUserReactions();
      } catch (err) {
        console.error('User session error', err);
      }
    };

    fetchUser();
    fetchReactionCounts();
  }, []);

  const fetchUserReactions = async () => {
    try {
      const res = await axios.get(API_BASE, { withCredentials: true });
      const liked = {}, disliked = {};
      res.data.forEach(({ course_id, type }) => {
        if (type === 'like') liked[course_id] = true;
        else if (type === 'dislike') disliked[course_id] = true;
      });
      setUserLikes(liked);
      setUserDislikes(disliked);
    } catch (err) {
      console.error('User reactions error', err);
    }
  };

  const fetchReactionCounts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/counts`);
      const likeCounts = {}, dislikeCounts = {};
      res.data.forEach(({ course_id, likes, dislikes }) => {
        likeCounts[course_id] = likes;
        dislikeCounts[course_id] = dislikes;
      });
      setLikes(likeCounts);
      setDislikes(dislikeCounts);
    } catch (err) {
      console.error('Reaction count error', err);
    }
  };

  const confirmDelete = async (courseId) => {
    try {
      await axios.delete(`${COURSES_API}/${courseId}`, {
        withCredentials: true,
      });
      console.log(`Course ${courseId} auto-deleted due to dislike ratio.`);
    } catch (err) {
      console.error('Auto delete error', err);
    }
  };

  const toggleReaction = async (courseId, type) => {
    if (!userId) {
      alert('You must be signed in to react.');
      return;
    }

    const isLiked = userLikes[courseId];
    const isDisliked = userDislikes[courseId];
    const isCurrent = type === 'like' ? isLiked : isDisliked;
    const isOpposite = type === 'like' ? isDisliked : isLiked;
    const oppositeType = type === 'like' ? 'dislike' : 'like';

    try {
      if (isCurrent) {
        await axios.delete(API_BASE, {
          data: { course_id: courseId, type },
          withCredentials: true,
        });

        if (type === 'like') {
          setLikes((prev) => ({ ...prev, [courseId]: Math.max((prev[courseId] || 1) - 1, 0) }));
          const { [courseId]: _, ...rest } = userLikes;
          setUserLikes(rest);
        } else {
          setDislikes((prev) => ({ ...prev, [courseId]: Math.max((prev[courseId] || 1) - 1, 0) }));
          const { [courseId]: _, ...rest } = userDislikes;
          setUserDislikes(rest);
        }
      } else {
        await axios.post(API_BASE, { course_id: courseId, type }, { withCredentials: true });

        if (type === 'like') {
          setLikes((prev) => ({ ...prev, [courseId]: (prev[courseId] || 0) + 1 }));
          setUserLikes((prev) => ({ ...prev, [courseId]: true }));
        } else {
          setDislikes((prev) => ({ ...prev, [courseId]: (prev[courseId] || 0) + 1 }));
          setUserDislikes((prev) => ({ ...prev, [courseId]: true }));
        }

        if (isOpposite) {
          await axios.delete(API_BASE, {
            data: { course_id: courseId, type: oppositeType },
            withCredentials: true,
          });

          if (type === 'like') {
            setDislikes((prev) => ({ ...prev, [courseId]: Math.max((prev[courseId] || 1) - 1, 0) }));
            const { [courseId]: _, ...rest } = userDislikes;
            setUserDislikes(rest);
          } else {
            setLikes((prev) => ({ ...prev, [courseId]: Math.max((prev[courseId] || 1) - 1, 0) }));
            const { [courseId]: _, ...rest } = userLikes;
            setUserLikes(rest);
          }
        }
      }

      // ✅ Fetch updated counts directly after action
      const freshRes = await axios.get(`${API_BASE}/counts`);
      const updatedCourse = freshRes.data.find(c => c.course_id === courseId);

      if (!updatedCourse) {
        console.warn(`Course ${courseId} not found in updated counts.`);
        return;
      }

      const { likes: updatedLikes, dislikes: updatedDislikes } = updatedCourse;
      const total = updatedLikes + updatedDislikes;
      const ratio = total > 0 ? updatedDislikes / total : 0;

      console.log(`Course ${courseId} — Likes: ${updatedLikes}, Dislikes: ${updatedDislikes}, Ratio: ${ratio}`);

      if (total >= 10 && ratio >= 0.75) {
        await confirmDelete(courseId);
      }

      // Final update to local state
      await fetchReactionCounts();

    } catch (err) {
      console.error('Toggle reaction error', err);
    }
  };

  return {
    likes,
    dislikes,
    userLikes,
    userDislikes,
    toggleLike: (id) => toggleReaction(id, 'like'),
    toggleDislike: (id) => toggleReaction(id, 'dislike'),
    likedCourseIds: Object.keys(userLikes),
    dislikedCourseIds: Object.keys(userDislikes),
    userId,
  };
};

export default useReactions;
