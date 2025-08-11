const express = require('express');
const router = express.Router();
const contentController = require('../controlleers/ContentController'); // ✅ FIX TYPO: 'controlleers' → 'controllers'
const multer = require('multer');
const path = require('path');
const authenticateUser = require('../middleware/authenticateUser'); // ✅ Import middleware

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'public/uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});
const upload = multer({ storage });

// ✅ Routes
router.get('/:courseId', contentController.getContentByCourseId); // Public access
router.post('/upload', authenticateUser, upload.single('file'), contentController.uploadContent); // Protected
router.delete('/:id', authenticateUser, contentController.deleteContent); // Protected

module.exports = router;
