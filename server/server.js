const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const app = express();

require('dotenv').config(); //dotenvを適用して、環境変数の値を取得する

app.use(cors());
app.use(express.json());
app.use(bodyparser.json())

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
const connection = mongoose.connection;

connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

require('./models/user');

const requireToken = require('./middleware/requireToken');
const AuthRoutes = require('./routes/authRoutes');
const BookRoutes = require('./routes/bookRoutes')
app.use(bodyparser.json());
app.use('/user', AuthRoutes);
app.use('/book', BookRoutes);

app.get('/user', requireToken, (req, res) => {
  res.send({email: req.user.email, username: req.user.username})
});

app.listen(process.env.PORT || 8000, () => {
  console.log(`turn on server: http://localhost:${process.env.PORT || 8000}`);
});