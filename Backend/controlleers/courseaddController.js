const db = require('../config/db');
const path = require('path');
const fs = require('fs');

// UPLOAD COURSE
exports.uploadCourse = async (req, res) => {
  try {
    const { name, description } = req.body;
    const thumbnail = req.file?.filename;

    const sessionUser = req.session?.user;
    if (!sessionUser) {
      return res.status(401).json({ message: 'Unauthorized: Please log in.' });
    }

    if (!name || !description || !thumbnail) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const imageUrl = `/uploads/courses/${thumbnail}`;
    const userId = sessionUser.id;

    db.query(
      'INSERT INTO courses (userId, name, image_url, description) VALUES (?, ?, ?, ?)',
      [userId, name, imageUrl, description],
      (err) => {
        if (err) {
          console.error('DB Error:', err);
          return res.status(500).json({ message: 'DB insert failed', error: err.sqlMessage || err.message });
        }
        res.status(201).json({ message: 'Course uploaded successfully' });
      }
    );
  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE COURSE
exports.deleteCourse = (req, res) => {
  const sessionUser = req.session?.user;
  if (!sessionUser) {
    return res.status(401).json({ message: 'Unauthorized: Please log in.' });
  }

  const courseId = req.params.id;

  const fetchQuery = 'SELECT image_url, userId FROM courses WHERE id = ?';
  db.query(fetchQuery, [courseId], (fetchErr, courseResults) => {
    if (fetchErr || courseResults.length === 0) {
      return res.status(404).json({ message: 'Course not found or DB error.' });
    }

    const course = courseResults[0];
    if (course.userId !== sessionUser.id) {
      return res.status(403).json({ message: 'Forbidden: You can only delete your own course.' });
    }

    const imageRelativeUrl = course.image_url || '';
    const thumbnailPath = path.join(__dirname, '..', imageRelativeUrl);

    // Delete related content
    db.query('DELETE FROM course_contents WHERE course_id = ?', [courseId], (err1) => {
      if (err1) return res.status(500).json({ message: 'Error deleting course contents.' });

      db.query('DELETE FROM reactions WHERE course_id = ?', [courseId], (err2) => {
        if (err2) return res.status(500).json({ message: 'Error deleting reactions.' });

        db.query('DELETE FROM courses WHERE id = ?', [courseId], (err3) => {
          if (err3) return res.status(500).json({ message: 'Error deleting course.' });

          fs.unlink(thumbnailPath, (fsErr) => {
            if (fsErr && fsErr.code !== 'ENOENT') {
              console.warn('Thumbnail deletion warning:', fsErr.message);
            }
            res.status(200).json({ message: 'Course and related data deleted successfully.' });
          });
        });
      });
    });
  });
};
