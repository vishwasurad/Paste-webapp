const express = require('express');
const router = express.Router();
const { handleSignup,handleLogin}= require('../controllers/user-controller');


// Signup route
router.post('/signup', handleSignup);

// Login route
router.post('/login',handleLogin );

module.exports = router;