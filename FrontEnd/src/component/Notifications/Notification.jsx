import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideWindow from "../NavBar";

const NotificationPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [allQuestions, setAllQuestions] = useState([]);
  const [allAnswers, setAllAnswers] = useState([]);

  // Step 1: Authenticate and fetch user
  useEffect(() => {
    const fetchSessionAndUser = async () => {
      try {
        const sessionRes = await fetch("http://localhost:5000/api/auth/session", {
          credentials: "include",
        });

        if (!sessionRes.ok) throw new Error("No active session");

        const userRes = await fetch("http://localhost:5000/api/auth/me", {
          credentials: "include",
        });

        if (!userRes.ok) throw new Error("Failed to get user info");

        const userData = await userRes.json();

        setCurrentUser({
          id: userData.id,
          username: userData.name,
        });
      } catch (err) {
        console.error("Auth/session error:", err);
        navigate("/signin");
      }
    };

    fetchSessionAndUser();
  }, [navigate]);

  // Step 2: Fetch data
  useEffect(() => {
    if (!currentUser) return;

    const fetchData = async () => {
      try {
        const [questionsRes, answersRes] = await Promise.all([
          fetch("http://localhost:5000/api/questions", {
            credentials: "include",
          }),
          fetch("http://localhost:5000/api/questions/answers/all", {
            credentials: "include",
          }),
        ]);

        if (!questionsRes.ok || !answersRes.ok) {
          throw new Error("Failed to fetch questions or answers");
        }

        const questions = await questionsRes.json();
        const answers = await answersRes.json();

        setAllQuestions(Array.isArray(questions) ? questions : questions.data || []);
        setAllAnswers(Array.isArray(answers) ? answers : answers.data || []);
      } catch (err) {
        console.error("Data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  // Step 3: Combine notifications
  useEffect(() => {
    if (!currentUser) return;

    const userQuestions = allQuestions.filter((q) => q.user === currentUser.username);
    const userAnswers = allAnswers.filter((a) => a.user === currentUser.username);

    const questionNotifications = userQuestions.map((q) => ({
      type: "question",
      id: q.id,
      text: `You asked: "${q.text}"`,
      timestamp: q.created_at,
    }));

    const answerNotifications = userAnswers.map((a) => ({
      type: "answer",
      id: a.id,
      text: `You answered: "${a.answer_text}"`,
      questionId: a.question_id,
      isCorrect: a.is_correct,
      timestamp: a.created_at,
    }));

    const combined = [...questionNotifications, ...answerNotifications].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    setNotifications(combined);
  }, [allQuestions, allAnswers, currentUser]);

  const handleClick = (item) => {
    if (item.type === "question") {
      navigate(`/questions/${item.id}`);
    } else if (item.type === "answer") {
      navigate(`/questions/${item.questionId}`);
    }
  };

  if (loading || !currentUser) {
    return <p className="text-center mt-6 text-gray-500">Loading notifications...</p>;
  }

  return (
    <>
      <SideWindow />
      <div className="fixed top-[100px] left-[10%] right-[10%] h-[calc(100vh-100px)] overflow-y-auto bg-gray-100 px-4 py-6">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">Notifications</h2>

          {notifications.length === 0 ? (
            <p className="text-center text-gray-500 text-lg">No notifications yet.</p>
          ) : (
            <div className="space-y-6">
              {notifications.map((item) => (
                <div
                  key={`${item.type}-${item.id}`}
                  onClick={() => handleClick(item)}
                  className="p-5 bg-gray-50 border border-gray-200 rounded-xl hover:bg-blue-50 cursor-pointer transition-all duration-200 shadow-sm"
                >
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-gray-900 text-base">{item.text}</p>
                    {item.isCorrect && (
                      <span className="text-green-600 font-semibold text-sm ml-4">
                        ✅ Correct Answer
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationPage;
