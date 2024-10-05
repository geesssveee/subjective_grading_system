const express = require('express');
const router = express.Router();
const User = require('../model/user');
const bcrypt = require('bcryptjs');

router.post('/', async (req, res) => {
  try {
    console.log("I am here!");
    const { Fullname, email, password,isteacher,idno } = req.body;
    const existingUser = await User.findOne({ 'creds.email': email });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(email,hashedPassword);
    const newUser = new User({
      Fullname,
      creds: {
        email,
        password: hashedPassword,
      },

    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;