const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');

dotenv.config();
const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use('/api', authRoutes);

app.listen(3000, () => console.log('Server running on port 3000'));
