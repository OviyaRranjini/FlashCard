const express = require("express");
const router = express.Router();
const questionsController = require("../controlleers/QuestionController");
const answersController = require("../controlleers/AnswerController");
const authenticateUser = require("../middleware/authenticateUser");

// Question routes
router.get("/", questionsController.getAllQuestions);
router.get("/question/:id", answersController.getQuestionById); // ✅ FIXED

router.post("/", authenticateUser, questionsController.addQuestion);
router.put("/:id", authenticateUser, questionsController.editQuestion);
router.delete("/:id", authenticateUser, questionsController.deleteQuestion);

// Answer routes (based on question ID)
router.get("/:questionId/answers", answersController.getAnswersByQuestionId);
router.post("/:questionId/answers", authenticateUser, answersController.createAnswer);

// Individual answer routes
router.put("/answers/:id", authenticateUser, answersController.updateAnswer);
router.delete("/answers/:id", authenticateUser, answersController.deleteAnswer);
router.get("/answers/all", answersController.getAllAnswers);

module.exports = router;
