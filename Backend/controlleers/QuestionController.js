const db = require('../config/db');

// Get all questions (public)
exports.getAllQuestions = (req, res) => {
  db.query('SELECT * FROM questions', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Add a new question (session-based)
exports.addQuestion = (req, res) => {
  const userSession = req.session?.user;

  if (!userSession || !userSession.id) {
    return res.status(401).json({ error: "Unauthorized: Please log in" });
  }

  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "text is required" });

  db.query(
    'INSERT INTO questions (text, user) VALUES (?, ?)',
    [text, userSession.name],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      res.status(201).json({
        id: result.insertId,
        text,
        user: userSession.name,
        created_at: new Date(), // optional if DB handles it
      });
    }
  );
};

// Edit a question (session-based)
exports.editQuestion = (req, res) => {
  const userSession = req.session?.user;

  if (!userSession || !userSession.name) {
    return res.status(401).json({ error: "Unauthorized: Please log in" });
  }

  const { id } = req.params;
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'text is required' });
  }

  // Optional: you could verify if this user is the author of the question
  const sql = 'UPDATE questions SET text = ?, user = ? WHERE id = ?';
  db.query(sql, [text, userSession.name, id], (err, result) => {
    if (err) {
      console.error('Error updating question:', err);
      return res.status(500).json({ error: err.message });
    }

    res.json({ message: 'Question updated successfully' });
  });
};

// Delete a question (session-based)
exports.deleteQuestion = (req, res) => {
  const userSession = req.session?.user;

  if (!userSession || !userSession.id) {
    return res.status(401).json({ error: "Unauthorized: Please log in" });
  }

  const { id } = req.params;

  db.query('DELETE FROM questions WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Question deleted" });
  });
};
