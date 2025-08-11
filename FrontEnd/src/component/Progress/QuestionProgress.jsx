import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const QnAOverviewPage = () => {
  const navigate = useNavigate();
  const [allQuestions, setAllQuestions] = useState([]);
  const [allAnswers, setAllAnswers] = useState([]);
  const [activeView, setActiveView] = useState("questions");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

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

        // ✅ Ensure username is available
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
  // console.log("userData:", currentUser);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [questionsRes, answersRes] = await Promise.all([
          fetch("http://localhost:5000/api/questions"),
          fetch("http://localhost:5000/api/questions/answers/all"),
        ]);

        if (!questionsRes.ok || !answersRes.ok) {
          throw new Error("Failed to fetch questions or answers");
        }

        const [questionsDataRaw, answersDataRaw] = await Promise.all([
          questionsRes.json(),
          answersRes.json(),
        ]);

        const questionsData = Array.isArray(questionsDataRaw)
          ? questionsDataRaw
          : questionsDataRaw.data || [];

        const answersData = Array.isArray(answersDataRaw)
          ? answersDataRaw
          : answersDataRaw.data || [];

        setAllQuestions(questionsData);
        setAllAnswers(answersData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleItemClick = (questionId) => {
    navigate(`/questions/${questionId}`);
  };

  // ✅ FILTER by username
  

  const userQuestions = currentUser
    ? allQuestions.filter((q) => q.user === currentUser.username)
    : [];

  const userAnswers = currentUser
    ? allAnswers.filter((ans) => ans.user === currentUser.username)
    : [];

  if (loading || !currentUser) {
    return <p className="text-center mt-6 text-gray-500">Loading user data...</p>;
  }

  return (
    <div className="w-full max-w-5xl p-6 mx-auto flex-grow bg-white rounded-2xl shadow-lg flex flex-col overflow-hidden">
      <h1 className="text-2xl font-bold mb-4 text-center">QnA Overview</h1>

      <div className="flex justify-start border-b border-gray-200 bg-white">
        <button
          onClick={() => setActiveView("questions")}
          className={`px-6 py-3 w-[50%] text-lg font-semibold transition-colors duration-200 ${
            activeView === "questions"
              ? "text-blue-700 border-b-2 border-blue-700"
              : "text-gray-600 hover:text-blue-500"
          }`}
        >
          My Questions
        </button>
        <button
          onClick={() => setActiveView("answers")}
          className={`px-6 py-3 w-[50%] text-lg font-semibold transition-colors duration-200 ${
            activeView === "answers"
              ? "text-blue-700 border-b-2 border-blue-700"
              : "text-gray-600 hover:text-blue-500"
          }`}
        >
          My Answers
        </button>
      </div>

      <div className="flex-grow overflow-y-auto p-4">
        {error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : activeView === "questions" ? (
          userQuestions.length === 0 ? (
            <p className="text-center text-gray-500">You haven't asked any questions yet.</p>
          ) : (
            userQuestions.map((q) => (
              <div
                key={q.id}
                onClick={() => handleItemClick(q.id)}
                className="bg-gray-50 p-4 mb-4 rounded-lg shadow-sm cursor-pointer hover:bg-blue-50"
              >
                <p className="text-sm text-gray-500">
                  Asked on {new Date(q.created_at).toLocaleString()}
                </p>
                <p className="text-lg font-medium text-gray-800">{q.text}</p>
              </div>
            ))
          )
        ) : userAnswers.length === 0 ? (
          <p className="text-center text-gray-500">You haven't answered any questions yet.</p>
        ) : (
          userAnswers.map((ans) => {
            const q = allQuestions.find((q) => q.id === ans.question_id);
            return (
              <div
                key={ans.id}
                onClick={() => handleItemClick(ans.question_id)}
                className="bg-gray-50 p-4 mb-4 rounded-lg shadow-sm cursor-pointer hover:bg-blue-50"
              >
                <p className="text-sm text-blue-700 mb-1">
                  Question:{" "}
                  <span className="font-semibold">
                    {q?.text || <span className="italic text-gray-400">[Deleted Question]</span>}
                  </span>
                </p>
                <p className="text-gray-800">{ans.answer_text}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Answered on {new Date(ans.created_at).toLocaleString()}
                </p>
                {ans.is_correct && (
                  <p className="text-green-600 text-sm mt-2 font-semibold">✅ Marked as correct</p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default QnAOverviewPage;
