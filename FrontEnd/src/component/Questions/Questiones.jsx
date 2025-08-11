import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SideWindow from "../NavBar";

const Questions = () => {
  const [message, setMessage] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [communityQuestions, setCommunityQuestions] = useState([]);
  const [userName, setUserName] = useState("User");
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [editingQuestionText, setEditingQuestionText] = useState("");

  const navigate = useNavigate();

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
        setUserName(userData.name || userData.username || "User");
      } catch (err) {
        console.error("Auth/session error:", err);
        navigate("/login"); // redirect if not authenticated
      }
    };

    const fetchQuestions = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/questions", {
          credentials: "include",
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setCommunityQuestions(data);
      } catch (err) {
        console.error("Error fetching questions:", err);
      }
    };

    fetchSessionAndUser();
    fetchQuestions();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setIsPosting(true);

    try {
      const res = await fetch("http://localhost:5000/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ text: message }),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const newQuestion = await res.json();
      setCommunityQuestions((prev) => [newQuestion, ...prev]);
      setMessage("");
      setExpanded(false);
    } catch (error) {
      console.error("Error posting question:", error);
    } finally {
      setIsPosting(false);
    }
  };

  const handleEditClick = (e, question) => {
    e.stopPropagation();
    setEditingQuestionId(question.id);
    setEditingQuestionText(question.text);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/questions/${editingQuestionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ text: editingQuestionText }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to edit question");
      }

      const updatedQuestions = communityQuestions.map((q) =>
        q.id === editingQuestionId ? { ...q, text: editingQuestionText } : q
      );
      setCommunityQuestions(updatedQuestions);
      setEditingQuestionId(null);
      setEditingQuestionText("");
    } catch (error) {
      console.error("Error editing question:", error);
    }
  };

  const handleCancelEdit = (e) => {
    e.stopPropagation();
    setEditingQuestionId(null);
    setEditingQuestionText("");
  };

  const handleDeleteQuestion = async (e, questionId) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this question?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/questions/${questionId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      setCommunityQuestions((prev) => prev.filter((q) => q.id !== questionId));
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const handleQuestionCardClick = (id) => {
    if (editingQuestionId !== id) {
      navigate(`/questions/${id}`);
    }
  };

  const toggleExpand = () => setExpanded(!expanded);

  return (
    <>
      <SideWindow />
      <div className="fixed right-0 left-[10%] top-[100px] h-[calc(100vh-100px)] w-[80%] p-6 rounded-2xl bg-gray-100 flex justify-center items-center">
        <div className="w-full max-w-4xl h-full bg-white rounded-lg shadow-lg relative flex flex-col">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-200 pb-3 px-4">
            Ask and Answer: {userName}
          </h2>

          <div className="flex-grow overflow-y-auto px-4 pb-4 mb-32">
            {communityQuestions.length === 0 ? (
              <p className="text-gray-500 text-center italic mt-10">
                No questions yet. Be the first to ask!
              </p>
            ) : (
              <div className="space-y-4">
                {communityQuestions.map((q) => (
                  <div
                    key={q.id}
                    className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100 relative"
                  >
                    {editingQuestionId === q.id ? (
                      <form onSubmit={handleEditSubmit} className="flex flex-col">
                        <textarea
                          value={editingQuestionText}
                          onChange={(e) => setEditingQuestionText(e.target.value)}
                          className="w-full p-2 border border-blue-300 rounded-md mb-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={3}
                        />
                        <div className="flex justify-end space-x-2">
                          <p
                            role="button"
                            tabIndex={0}
                            onClick={handleEditSubmit}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") handleEditSubmit(e);
                            }}
                            className="bg-green-500 text-white text-sm px-3 py-1 rounded-lg hover:bg-green-600 transition cursor-pointer select-none"
                          >
                            Save
                          </p>
                          <p
                            role="button"
                            tabIndex={0}
                            onClick={handleCancelEdit}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") handleCancelEdit(e);
                            }}
                            className="bg-gray-400 text-white text-sm px-3 py-1 rounded-lg hover:bg-gray-500 transition cursor-pointer select-none"
                          >
                            Cancel
                          </p>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div
                          onClick={() => handleQuestionCardClick(q.id)}
                          className="cursor-pointer hover:bg-blue-50 transition pb-2"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-500 italic">
                              Asked by{" "}
                              <span className="text-blue-700 font-semibold">{q.user}</span>
                            </span>
                            <span className="text-xs text-gray-400">
                              {new Date(q.created_at).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-gray-800 font-medium">{q.text}</p>
                        </div>

                        <div className="flex justify-end items-center pt-2 border-t border-gray-100 mt-2">
                          {userName === q.user && (
                            <div className="flex space-x-1 mr-2">
                              <button
                                onClick={(e) => handleEditClick(e, q)}
                                className="p-1 rounded-full text-blue-500 hover:bg-blue-100 transition-colors"
                                title="Edit question"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={(e) => handleDeleteQuestion(e, q.id)}
                                className="p-1 rounded-full text-red-500 hover:bg-red-100 transition-colors"
                                title="Delete question"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          )}

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/questions/${q.id}`);
                            }}
                            className="text-xs px-3 py-1 rounded-full font-semibold bg-green-200 text-green-800"
                          >
                            View Answers
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Post Form */}
          <form
            onSubmit={handleSubmit}
            className="absolute bottom-0 left-0 right-0 bg-blue-50 p-4 rounded-t-xl shadow-inner flex items-end space-x-3"
          >
            <button
              type="button"
              onClick={toggleExpand}
              className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
              title={expanded ? "Collapse textarea" : "Expand textarea"}
            >
              {expanded ? "➖" : "➕"}
            </button>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={`flex-1 p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400 ${
                expanded ? "h-32" : "h-12"
              } resize-none transition-all duration-300`}
              placeholder="Type your question..."
              required
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />

            <p
              role="button"
              tabIndex={0}
              onClick={(e) => {
                if (!isPosting && message.trim()) handleSubmit(e);
              }}
              onKeyDown={(e) => {
                if ((e.key === "Enter" || e.key === " ") && !isPosting && message.trim()) {
                  handleSubmit(e);
                }
              }}
              className={`bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 h-12 flex items-center justify-center select-none ${
                isPosting || !message.trim() ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              {isPosting ? "Posting..." : "Post"}
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Questions;
