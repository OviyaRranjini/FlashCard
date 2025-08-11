const express = require('express');
const router = express.Router();
const reactionController = require('../controlleers/ReactionController');
const authenticateUser = require('../middleware/authenticateUser');

// Public
router.get('/counts', reactionController.getReactionCounts); // GET /api/reactions/counts

// Authenticated routes
router.use(authenticateUser); // Protect the rest of the routes

router.get('/', reactionController.getUserReactions);       // GET /api/reactions
router.post('/', reactionController.addReaction);           // POST /api/reactions
router.delete('/', reactionController.removeReaction);      // DELETE /api/reactions

module.exports = router;
