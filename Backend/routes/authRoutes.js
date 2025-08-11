const express = require('express');
const router = express.Router();
const { signUp, signIn, logout, check, me } = require('../controlleers/authController'); // ✅ corrected

// Sign Up route
// console.log(signUp , signIn, logout, check);
router.post('/signUp', signUp);

// Sign In route
router.post('/signIn', signIn);

router.post('/logout',logout);

router.get('/session', check);

router.get('/me', me);



module.exports = router;
