import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

const AnswerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState("");

  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [editingAnswerText, setEditingAnswerText] = useState("");

  const [isAnswerTextareaMaximized, setIsAnswerTextareaMaximized] = useState(false);
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState(null);

  const newAnswerTextareaRef = useRef(null);
  const editingTextareaRefs = useRef({});
  const answersScrollRef = useRef(null);
  const answerFormRef = useRef(null);

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
        setUser(userData);
        setUserName(userData.name || userData.username || "User");
      } catch (err) {
        console.error("Auth/session error:", err);
        navigate("/signin");
      }
    };

    fetchSessionAndUser();
  }, [navigate]);

  useEffect(() => {
    Promise.all([
      fetch(`http://localhost:5000/api/questions/question/${id}`).then((res) => {
        if (!res.ok) throw new Error("Failed to fetch question");
        return res.json();
      }),
      fetch(`http://localhost:5000/api/questions/${id}/answers`).then((res) => {
        if (!res.ok) throw new Error("Failed to fetch answers");
        return res.json();
      }),
    ])
      .then(([questionData, answersData]) => {
        setQuestion(questionData);
        setAnswers(answersData);

        const viewed = JSON.parse(sessionStorage.getItem("viewedQuestions") || "[]");
        if (!viewed.includes(questionData.id)) {
          viewed.push(questionData.id);
          sessionStorage.setItem("viewedQuestions", JSON.stringify(viewed));
        }
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, [id]);

  useEffect(() => {
    if (newAnswerTextareaRef.current && !isAnswerTextareaMaximized) {
      const el = newAnswerTextareaRef.current;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [newAnswer, isAnswerTextareaMaximized]);

  useEffect(() => {
    if (editingAnswerId !== null) {
      const el = editingTextareaRefs.current[editingAnswerId];
      if (el) {
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
      }
    }
  }, [editingAnswerText, editingAnswerId]);

  useEffect(() => {
    if (answersScrollRef.current) {
      answersScrollRef.current.scrollTop = answersScrollRef.current.scrollHeight;
    }
  }, [answers.length]);

  useEffect(() => {
    if (isAnswerTextareaMaximized && newAnswerTextareaRef.current) {
      newAnswerTextareaRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isAnswerTextareaMaximized]);

  // ✅ Final version of answer submission
 const handleAnswerSubmit = async (e) => {
  e.preventDefault();

  const trimmedText = newAnswer.trim();
  if (!trimmedText) return;

  const payload = {
    answer_text: trimmedText,
  };

  try {
    const res = await fetch(`http://localhost:5000/api/questions/${id}/answers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      credentials: "include", // IMPORTANT for sending cookies (user session)
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result?.error || "Unknown error");

    // add the new answer to the list
    setAnswers((prev) => [
      ...prev,
      {
        id: result.id,
        answer_text: trimmedText,
        user: user.name, // optional: for display
        created_at: new Date(),
      },
    ]);

    setNewAnswer("");
    setIsAnswerTextareaMaximized(false);
  } catch (err) {
    console.error("Error posting answer:", err);
  }
};



  const handleEditClick = (answer) => {
    setEditingAnswerId(answer.id);
    setEditingAnswerText(answer.answer_text);
  };

  const handleEditSubmit = async (answerId) => {
    const trimmed = editingAnswerText.trim();
    if (!trimmed) return;

    try {
      const res = await fetch(`http://localhost:5000/api/questions/answers/${answerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer_text: trimmed }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to update");

      setAnswers((prev) =>
        prev.map((ans) => (ans.id === answerId ? { ...ans, answer_text: trimmed } : ans))
      );
      setEditingAnswerId(null);
      setEditingAnswerText("");
    } catch (err) {
      console.error("Error updating answer:", err);
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    if (!window.confirm("Are you sure you want to delete this answer?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/questions/answers/${answerId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete");

      setAnswers((prev) => prev.filter((ans) => ans.id !== answerId));
    } catch (err) {
      console.error("Error deleting answer:", err);
    }
  };

  if (!question || !userName) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="p-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-100 font-sans relative">
      <div className="flex-1 flex justify-center items-start overflow-hidden px-2">
        <div className="w-10/12 pt-4 flex flex-col">
          <div className="bg-white rounded-2xl shadow p-4 mb-4">
            <div className="flex items-center mb-3">
              <p
                onClick={() => navigate("/question")}
                className="mr-3 p-2 rounded-2xl w-13 bg-blue-700 text-white hover:bg-blue-800 cursor-pointer"
              >
                Back
              </p>
              <h2 className="text-2xl font-bold text-blue-800">Question Details</h2>
            </div>
            <h3 className="text-xl font-semibold text-blue-700 mb-1">Question:</h3>
            <p className="text-gray-800 text-lg mb-2">{question.text}</p>
            <p className="text-sm text-gray-500">by {question.user}</p>
          </div>

          <div ref={answersScrollRef} className="flex-1 overflow-y-auto w-full pb-40">
            <h3 className="text-xl font-bold text-gray-800 mb-3 px-1">Answers ({answers.length})</h3>
            <div className="space-y-4">
              {answers.length === 0 ? (
                <p className="text-gray-500 italic text-center py-8 bg-white rounded-lg shadow-sm">
                  No answers yet. Be the first to provide one!
                </p>
              ) : (
                answers.map((ans) => (
                  <div key={ans.id} className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
                    {editingAnswerId === ans.id ? (
                      <div className="flex flex-col">
                        <textarea
                          ref={(el) => (editingTextareaRefs.current[ans.id] = el)}
                          className="border border-blue-300 rounded p-2 mb-2 resize-none w-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={3}
                          value={editingAnswerText}
                          onChange={(e) => setEditingAnswerText(e.target.value)}
                          placeholder="Edit your answer..."
                        />
                        <div className="flex justify-end gap-2">
                          <p
                            onClick={() => handleEditSubmit(ans.id)}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-semibold cursor-pointer"
                          >
                            Save
                          </p>
                          <p
                            onClick={() => setEditingAnswerId(null)}
                            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 font-semibold cursor-pointer"
                          >
                            Cancel
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-gray-800 text-base leading-relaxed">
                          <span className="font-semibold text-blue-600">{ans.user}:</span>{" "}
                          {ans.answer_text}
                        </p>
                        {ans.is_correct && (
                          <p className="text-green-600 text-sm mt-1 font-semibold flex items-center">
                            ✔ Marked as correct
                          </p>
                        )}
                        {user?.name === ans.user && (
                          <div className="flex justify-end mt-2 space-x-2 border-t border-gray-100 pt-2">
                            <p
                              onClick={() => handleEditClick(ans)}
                              className="text-blue-500 hover:text-blue-700 text-sm font-medium cursor-pointer"
                            >
                              ✏ Edit
                            </p>
                            <p
                              onClick={() => handleDeleteAnswer(ans.id)}
                              className="text-red-500 hover:text-red-700 text-sm font-medium cursor-pointer"
                            >
                              🗑 Delete
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div ref={answerFormRef} className="fixed bottom-2 left-1/2 -translate-x-1/2 w-[96%] max-w-4xl z-20">
        <form
          onSubmit={handleAnswerSubmit}
          className="p-4 bg-blue-50 border border-blue-200 rounded-lg shadow-lg flex flex-col gap-3 items-end relative"
        >
          <p
            onClick={() => setIsAnswerTextareaMaximized((prev) => !prev)}
            className="absolute top-2 left-2 w-7 h-7 text-sm font-bold text-blue-700 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center cursor-pointer"
            title={isAnswerTextareaMaximized ? "Collapse textarea" : "Expand textarea"}
          >
            {isAnswerTextareaMaximized ? "➖" : "➕"}
          </p>

          <textarea
            ref={newAnswerTextareaRef}
            className={`border border-blue-300 rounded p-2 resize-none w-full focus:ring focus:ring-blue-400 transition-all duration-300 ${
              isAnswerTextareaMaximized ? "h-40" : "h-12"
            } overflow-auto`}
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            placeholder="Type your answer here..."
          />

          <p
            onClick={newAnswer.trim() ? handleAnswerSubmit : undefined}
            className={`bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-bold cursor-pointer transition-colors duration-200 ${
              !newAnswer.trim() ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            Post Answer
          </p>
        </form>
      </div>
    </div>
  );
};

export default AnswerPage;
