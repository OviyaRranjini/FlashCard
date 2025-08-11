const db = require('../config/db');

// Utility function to get authenticated user's username
function getAuthenticatedUsername(req) {
  return req.session?.user?.username || req.user?.username || null;
}

// Get all answers for a specific question
exports.getAnswersByQuestionId = (req, res) => {
  const { questionId } = req.params;

  db.query(
    'SELECT * FROM answers WHERE question_id = ? ORDER BY created_at DESC',
    [questionId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
};

// Get all answers
exports.getAllAnswers = (req, res) => {
  db.query("SELECT * FROM answers ORDER BY created_at DESC", (err, results) => {
    if (err) {
      console.error("Error fetching answers:", err);
      return res.status(500).json({ error: "Failed to fetch answers" });
    }
    res.json(results);
  });
};

// Create a new answer for a specific question
exports.createAnswer = (req, res) => {
  const userSession = req.session?.user;

  if (!userSession || !userSession.name) {
    return res.status(401).json({ error: 'Unauthorized: Please log in' });
  }

  const { questionId } = req.params;
  const { answer_text } = req.body;

  if (!answer_text) {
    return res.status(400).json({ error: 'answer_text is required' });
  }

  const created_at = new Date();

  db.query(
    'INSERT INTO answers (question_id, answer_text, user, created_at) VALUES (?, ?, ?, ?)',
    [questionId, answer_text, userSession.name, created_at],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Answer added', id: result.insertId });
    }
  );
};

// Get a single question by ID
exports.getQuestionById = (req, res) => {
  const { id } = req.params;

  db.query('SELECT * FROM questions WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Question not found' });
    res.json(results[0]);
  });
};

// Update an existing answer (only text)
exports.updateAnswer = (req, res) => {
  const { id } = req.params;
  const { answer_text } = req.body;

  if (!answer_text) {
    return res.status(400).json({ error: 'answer_text is required' });
  }

  db.query(
    'UPDATE answers SET answer_text = ? WHERE id = ?',
    [answer_text, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Answer updated' });
    }
  );
};

// Delete an answer
exports.deleteAnswer = (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM answers WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Answer deleted' });
  });
};
