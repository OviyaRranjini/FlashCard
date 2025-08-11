const path = require('path');
const fs = require('fs');
const db = require('../config/db');
// const authenticateUser = require('../middleware/authenticateUser');


// GET content by course ID
exports.getContentByCourseId = (req, res) => {
  const { courseId } = req.params;

  const query = 'SELECT * FROM course_contents WHERE course_id = ? ORDER BY uploaded_at DESC';
  db.query(query, [courseId], (err, results) => {
    if (err) {
      console.error("Fetch Error:", err);
      return res.status(500).json({ message: 'Error fetching course contents.' });
    }
    res.json(results);
  });
};

// POST new content (upload)
exports.uploadContent = (req, res) => {
  const user = req.session?.user;
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized: Please log in.' });
  }

  try {
    const { course_id, type, title, text_input } = req.body;
    const uploaded_at = new Date();
    const content_url = req.file ? `/uploads/${req.file.filename}` : '';

    const insertQuery = `
      INSERT INTO course_contents (course_id, type, title, content_url, text_input, uploaded_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [course_id, type, title, content_url, text_input || '', uploaded_at];

    db.query(insertQuery, values, (err, results) => {
      if (err) {
        console.error("Insert Error:", err);
        return res.status(500).json({ message: 'Error inserting content.' });
      }

      res.status(201).json({
        message: 'Content uploaded successfully.',
        content_id: results.insertId,
      });
    });
  } catch (error) {
    console.error("Upload Content Error:", error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// DELETE content by ID
exports.deleteContent = (req, res) => {
  const user = req.session?.user;
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized: Please log in.' });
  }

  const contentId = req.params.id;

  const selectQuery = 'SELECT content_url FROM course_contents WHERE id = ?';
  db.query(selectQuery, [contentId], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ message: 'Content not found.' });
    }

    const contentUrl = results[0].content_url;

    const deleteQuery = 'DELETE FROM course_contents WHERE id = ?';
    db.query(deleteQuery, [contentId], (deleteErr) => {
      if (deleteErr) {
        console.error("Delete Error:", deleteErr);
        return res.status(500).json({ message: 'Error deleting content.' });
      }

      // Delete the file from the uploads directory
      if (contentUrl) {
        const filePath = path.join(__dirname, '..', 'public', contentUrl.replace(/^\/+/, ''));
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) {
            console.warn("File deletion warning:", unlinkErr.message);
          }
        });
      }

      res.status(200).json({ message: 'Content deleted successfully.' });
    });
  });
};
