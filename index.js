const express = require('express');
const { resolve } = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./schema'); 

dotenv.config();

const app = express();
const port = 3010;

app.use(express.json());
app.use(express.static('static'));

mongoose.connect(process.env.mongoURI)
  .then(() => console.log('Connected to database'))
  .catch(err => console.error('Database connection error:', err));

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.post('/api/users', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Validation error: All fields are required' });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
