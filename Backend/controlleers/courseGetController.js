const db = require('../config/db');

// GET all courses (public)
exports.getCourses = (req, res) => {
  db.query(
    'SELECT id, name, image_url AS image, description, created_at FROM courses',
    (err, results) => {
      if (err) {
        console.error('DB Error:', err);
        return res.status(500).json({ message: 'Failed to fetch courses' });
      }
      res.json(results);
    }
  );
};

// GET courses by current user
exports.getUserCreatedCourse = (req, res) => {
  const sessionUser = req.session?.user;

  if (!sessionUser || !sessionUser.id) {
    return res.status(401).json({ message: 'Unauthorized: Please log in.' });
  }

  db.query(
    'SELECT id, name, image_url AS image, description, created_at FROM courses WHERE userId = ?',
    [sessionUser.id],
    (err, results) => {
      if (err) {
        console.error('DB Error:', err);
        return res.status(500).json({ message: 'Failed to fetch user-created courses' });
      }
      res.json(results);
    }
  );
};
