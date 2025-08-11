const db = require('../config/db');
const path = require('path');
const fs = require('fs');

// ✅ Get all reactions by the currently logged-in user
exports.getUserReactions = (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: 'Unauthorized: Please log in' });

  db.query('SELECT user_id, course_id, type FROM reactions WHERE user_id = ?', [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// ✅ Get like/dislike counts per course (public)
exports.getReactionCounts = (req, res) => {
  const sql = `
    SELECT 
      course_id,
      SUM(type = 'like') AS likes,
      SUM(type = 'dislike') AS dislikes
    FROM reactions
    GROUP BY course_id
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// ✅ Add or update a reaction
exports.addReaction = (req, res) => {
  const userId = req.user?.id;
  const { course_id, type } = req.body;

  if (!userId || !course_id || !type) {
    return res.status(400).json({ message: 'Missing data or not authenticated' });
  }

  const insertSql = `
    INSERT INTO reactions (user_id, course_id, type)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE type = VALUES(type), created_at = CURRENT_TIMESTAMP
  `;

  db.query(insertSql, [userId, course_id, type], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    const statsSql = `
      SELECT 
        COUNT(*) AS total_reactions,
        SUM(type = 'dislike') AS total_dislikes
      FROM reactions
      WHERE course_id = ?
    `;

    db.query(statsSql, [course_id], (statsErr, statsResults) => {
      if (statsErr) return res.status(500).json({ error: 'Failed to evaluate reactions.' });

      const total = statsResults[0].total_reactions;
      const dislikes = statsResults[0].total_dislikes;

      const shouldDelete = total > 10 && (dislikes / total) > 0.75 && dislikes >= total / 2;

      if (!shouldDelete) {
        return res.json({
          message: 'Reaction saved',
          id: result.insertId || result.insertId,
          stats: { total, dislikes },
        });
      }

      // Course auto-deletion
      const fetchImageQuery = 'SELECT image_url FROM courses WHERE id = ?';
      db.query(fetchImageQuery, [course_id], (fetchErr, fetchResult) => {
        if (fetchErr || !fetchResult.length) {
          return res.status(500).json({ error: 'Failed to get image URL' });
        }

        const imageRelativeUrl = fetchResult[0].image_url;
        const thumbnailPath = path.join(__dirname, '..', imageRelativeUrl);

        db.query('DELETE FROM course_contents WHERE course_id = ?', [course_id], (delContentsErr) => {
          if (delContentsErr) return res.status(500).json({ error: 'Error deleting course contents.' });

          db.query('DELETE FROM reactions WHERE course_id = ?', [course_id], (delReactionsErr) => {
            if (delReactionsErr) return res.status(500).json({ error: 'Error deleting reactions.' });

            db.query('DELETE FROM courses WHERE id = ?', [course_id], (delCourseErr) => {
              if (delCourseErr) return res.status(500).json({ error: 'Error deleting course.' });

              fs.unlink(thumbnailPath, (fsErr) => {
                if (fsErr && fsErr.code !== 'ENOENT') {
                  console.warn('Failed to delete thumbnail:', fsErr.message);
                }

                return res.status(200).json({
                  message: 'Reaction saved. Course deleted due to poor feedback.',
                  stats: { total, dislikes },
                });
              });
            });
          });
        });
      });
    });
  });
};

// ✅ Remove a reaction
exports.removeReaction = (req, res) => {
  const userId = req.user?.id;
  const { course_id, type } = req.body;

  if (!userId || !course_id || !type) {
    return res.status(400).json({ message: 'Missing data or not authenticated' });
  }

  const sql = `DELETE FROM reactions WHERE user_id = ? AND course_id = ? AND type = ?`;
  db.query(sql, [userId, course_id, type], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Reaction removed' });
  });
};
