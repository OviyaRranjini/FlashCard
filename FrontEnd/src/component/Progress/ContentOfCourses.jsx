import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ContentAdd = () => {
  const { courseId, courseName } = useParams();
  const navigate = useNavigate();

  const [contentItems, setContentItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Session check
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/session', {
          withCredentials: true,
        });
        if (!res.data.loggedIn) {
          alert('You are not logged in. Please log in.');
          navigate('/signin');
        }
      } catch (err) {
        console.error(err);
        navigate('/signin');
      }
    };

    checkSession();
  }, [navigate]);

  // ✅ Fetch existing content
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/content/${courseId}`, {
          withCredentials: true,
        });
        const mapped = res.data.map(item => ({
          id: item._id || item.id,
          type: item.type,
          title: item.title,
          textInput: item.text_input || '',
          file: null,
          status: 'Uploaded successfully!',
          isLoading: false,
          fileInputKey: 0,
          isSubmitted: true,
        }));
        setContentItems(mapped);
      } catch (err) {
        console.error('Error fetching course contents:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, [courseId]);

  const handleAddItem = () => {
    setContentItems(prevItems => [
      {
        id: Date.now(),
        type: '',
        title: '',
        textInput: '',
        file: null,
        status: '',
        isLoading: false,
        fileInputKey: 0,
        isSubmitted: false,
      },
      ...prevItems,
    ]);
  };

  const handleItemChange = (id, field, value) => {
    setContentItems(prevItems =>
      prevItems.map(item =>
        item.id === id
          ? {
              ...item,
              [field]: value,
              status: '',
              ...(field === 'type'
                ? { textInput: '', file: null, fileInputKey: item.fileInputKey + 1 }
                : {}),
            }
          : item
      )
    );
  };

  const handleFileChange = (id, file) => {
    setContentItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, file, status: '' } : item
      )
    );
  };

  const handleSubmitItem = async itemId => {
    const item = contentItems.find(i => i.id === itemId);
    if (!item) return;

    const updateItem = updates =>
      setContentItems(prev =>
        prev.map(it => (it.id === itemId ? { ...it, ...updates } : it))
      );

    updateItem({ isLoading: true, status: 'Uploading...' });

    if (!item.type || !item.title) {
      updateItem({ isLoading: false, status: 'Error: Type and Title are required.' });
      return;
    }
    if (item.type === 'text' && !item.textInput.trim()) {
      updateItem({ isLoading: false, status: 'Error: Text content is required.' });
      return;
    }
    if ((item.type === 'video' || item.type === 'pdf') && !item.file) {
      updateItem({ isLoading: false, status: `Error: A file is required for "${item.type}".` });
      return;
    }

    const formData = new FormData();
    formData.append('course_id', courseId);
    formData.append('type', item.type);
    formData.append('title', item.title);
    if (item.type === 'text') {
      formData.append('text_input', item.textInput);
    } else {
      formData.append('file', item.file);
    }

    try {
      await axios.post('http://localhost:5000/api/content/upload', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      updateItem({
        isLoading: false,
        status: 'Uploaded successfully!',
        isSubmitted: true,
      });
    } catch (err) {
      updateItem({
        isLoading: false,
        status: `Error: ${err.response?.data?.message || err.message}`,
      });
    }
  };

  const handleDeleteUploadedItem = async id => {
    if (!window.confirm('Are you sure you want to delete this content?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/content/${id}`, {
        withCredentials: true,
      });
      setContentItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      alert('Failed to delete content: ' + (err.response?.data?.message || err.message));
    }
  };

  const renderContentForm = (item, index) => {
    const isSubmitDisabled = item.isLoading || !item.type || !item.title ||
      (item.type === 'text' && !item.textInput.trim()) ||
      ((item.type === 'video' || item.type === 'pdf') && !item.file);

    return (
      <div key={item.id} className="bg-white p-6 rounded-lg shadow-md mb-6 border border-blue-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-blue-800">
            Content Block #{contentItems.length - index}
          </h3>
          {item.isSubmitted ? (
            <button
              onClick={() => handleDeleteUploadedItem(item.id)}
              className="text-red-500 hover:text-red-700 text-sm font-medium"
            >
              Delete
            </button>
          ) : (
            <p
              onClick={() => setContentItems(prev => prev.filter(it => it.id !== item.id))}
              className="text-red-500 hover:text-red-700 font-medium cursor-pointer"
            >
              Delete
            </p>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmitItem(item.id);
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              value={item.type}
              onChange={(e) => handleItemChange(item.id, 'type', e.target.value)}
              disabled={item.isLoading || item.isSubmitted}
              className="w-full mt-1 rounded-md border border-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-200 bg-white text-gray-800"
            >
              <option value="">Select Type</option>
              <option value="video">Video</option>
              <option value="pdf">PDF</option>
              <option value="text">Text</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={item.title}
              onChange={(e) => handleItemChange(item.id, 'title', e.target.value)}
              disabled={item.isLoading || item.isSubmitted}
              className="w-full mt-1 rounded-md border border-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-200 bg-white text-gray-800"
            />
          </div>

          {item.type === 'text' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Text Content</label>
              <textarea
                value={item.textInput}
                onChange={(e) => handleItemChange(item.id, 'textInput', e.target.value)}
                rows="4"
                disabled={item.isLoading || item.isSubmitted}
                className="w-full mt-1 rounded-md border border-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-200 bg-white text-gray-800"
              />
            </div>
          )}

          {(item.type === 'video' || item.type === 'pdf') && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Upload File</label>
              <input
                key={`file-${item.id}-${item.fileInputKey}`}
                type="file"
                accept={item.type === 'video' ? 'video/*' : 'application/pdf'}
                onChange={(e) => handleFileChange(item.id, e.target.files[0])}
                disabled={item.isLoading || item.isSubmitted}
                className="w-full mt-1 rounded-md border border-gray-400 bg-white text-gray-800"
              />
              {item.file && !item.isSubmitted && (
                <p className="text-xs text-gray-500 mt-1">Selected: {item.file.name}</p>
              )}
            </div>
          )}

          {!item.isSubmitted && (
            <p
              onClick={(e) => {
                e.preventDefault();
                if (!isSubmitDisabled) handleSubmitItem(item.id);
              }}
              className={`text-center font-bold cursor-pointer w-full py-2 px-4 text-white rounded-md ${
                isSubmitDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {item.isLoading ? 'Uploading...' : 'Upload This Content'}
            </p>
          )}

          {item.status && (
            <p
              className={`text-sm mt-3 text-center ${
                item.status.toLowerCase().includes('error') ? 'text-red-600' : 'text-green-600'
              }`}
            >
              {item.status}
            </p>
          )}
        </form>
      </div>
    );
  };

  return (
    <>
      <p
        onClick={() => navigate(`/${courseId}/${encodeURIComponent(courseName)}`)}
        className="absolute top-6 right-6 bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-2 px-4 rounded-lg shadow-sm cursor-pointer"
      >
        Done
      </p>

      <div className="flex justify-center min-h-screen w-screen bg-gray-50 py-10 px-4">
        <div className="w-full max-w-2xl">
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg shadow-sm mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
              Add Content to: <span className="ml-2 text-blue-700 font-bold">{courseName}</span>
            </h2>
          </div>

          <div className="mt-6 text-center mb-4">
            <p
              onClick={handleAddItem}
              className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
            >
              + Add another content block
            </p>
          </div>

          {!isLoading && contentItems.length > 0 && contentItems.every(i => i.isSubmitted) && (
            <div className="text-green-700 text-center font-semibold mb-4">
              ✅ All content blocks uploaded successfully!
            </div>
          )}

          {isLoading ? (
            <p className="text-center text-gray-500">Loading content...</p>
          ) : (
            contentItems.map(renderContentForm)
          )}
        </div>
      </div>
    </>
  );
};

export default ContentAdd;
