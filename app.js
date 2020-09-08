const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const home = require('./routes/home');
const feed = require('./routes/feed');
const auth = require('./routes/auth');
const socketIO = require('./socketIO');

const app = express();

const url = 'mongodb://127.0.0.1:27017/fullstack'
const port = 6060;

app.use(cors());

app.use(bodyParser.json()); // application/json)

app.use('/home', home);
app.use('/feed', feed);
app.use('/auth', auth);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});


mongoose
  .connect('mongodb+srv://test:test@cluster0-sosu9.mongodb.net/test')
  // .connect(url)
  .then(result => {
    const server = app.listen(port);
    const io = require('./socket').init(server);
    io.on('connection', socket => {
      console.log('Client connected');
      socketIO();
    });
  })
  .catch(err => console.log(err));