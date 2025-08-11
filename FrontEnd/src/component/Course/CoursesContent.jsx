import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CourseContent = () => {
  const { courseId, courseName } = useParams();
  const navigate = useNavigate();
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/content/${courseId}`)
      .then(res => {
        setContents(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load course contents.');
        setLoading(false);
      });
  }, [courseId]);

  const handleBack = () => {
    navigate('/course'); // change to your actual route
  };

  return (
    <div className="p-6 bg-gray-100 w-screen min-h-screen">
      {/* 🔙 Back Button */}
      <p
        onClick={handleBack}
        className="cursor-pointer w-25 mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all"
      >
        ← Back
      </p>

      <h2 className="text-3xl font-bold mb-6">
        Content for: <span className="text-blue-700">{courseName}</span>
      </h2>

      {loading ? (
        <p>Loading content...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : contents.length === 0 ? (
        <p>No content available.</p>
      ) : (
        <ul className="space-y-4">
          {contents.map(content => (
            <li key={content.id} className="p-4 bg-white rounded shadow">
              <p className="font-medium text-lg">{content.title}</p>
              {content.content_url && (
                <a
                  href={`http://localhost:5000/${content.content_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline text-sm"
                >
                  View File
                </a>
              )}
              {content.text_input && (
                <p className="text-gray-700 mt-2 text-sm">{content.text_input}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CourseContent;
