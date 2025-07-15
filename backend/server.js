// server.js
require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/user.login');
const postRouter = require('./routes/user.post')

const app = express();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Database connected ✅'))
  .catch((err) => console.error('Database connection error ❌', err));

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: process.env.FRONTEND_URL, // frontend domain
  credentials: true,
  sameSite: 'None',
}));

app.use('/user', userRouter);
app.use('/post', postRouter);

app.listen(process.env.PORT, () => {
  console.log("Server started on port 3000 ✅");
});
