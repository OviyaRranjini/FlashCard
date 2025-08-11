const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const courseController = require('../controlleers/courseaddController');
const authenticateUser = require('../middleware/authenticateUser');
const courseGetController = require('../controlleers/courseGetController');

// Ensure uploads folder exists
const uploadPath = path.join(__dirname, '..', 'uploads', 'courses');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Setup multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// Routes
router.post('/upload', authenticateUser, upload.single('thumbnail'), courseController.uploadCourse);
router.get('/', courseGetController.getCourses);
router.get('/UserCreated', courseGetController.getUserCreatedCourse);
router.delete('/:id', authenticateUser, courseController.deleteCourse);

module.exports = router;
