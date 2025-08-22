const express = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/User');

const router = express.Router();


router.get('/register', (req, res) => {
  res.render('register', { error: null });
});


router.post('/register', async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.render('register', { error: 'Passwords do not match!' });
  }

  try {
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.render('register', { error: 'Username or email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();
    res.redirect('/login');

  } catch (err) {
    console.error(err.message);
    res.status(500).render('register', { error: 'Server Error. Please try again.' });
  }
});


router.get('/login', (req, res) => {
  
  res.render('login', { error: null });
});


router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.render('login', { error: 'Invalid username or password.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('login', { error: 'Invalid username or password.' });
        }

      
        res.render('dashboard', { user: user });

    } catch (err) {
        console.error(err.message);
        res.status(500).render('login', { error: 'Server Error.' });
    }
});

module.exports = router;