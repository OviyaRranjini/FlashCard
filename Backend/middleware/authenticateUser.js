// middlewares/authenticateUser.js

const authenticateUser = (req, res, next) => {
  // Check if session and user exist
  if (req.session && req.session.user) {
    req.user = req.session.user; // Attach user to request for downstream use
    return next(); // Continue to next middleware or route handler
  }

  // If not authenticated, return a 401 Unauthorized response
  return res.status(401).json({
    success: false,
    message: 'Unauthorized: You must be logged in to perform this action.',
  });
};

module.exports = authenticateUser;
