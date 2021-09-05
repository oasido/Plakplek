'use strict';
// ExpressJS set up
const express = require('express');
const app = express();
const port = 3000;
const dotenv = require('dotenv');
require('dotenv').config();

// Add MongooseDB
const Document = require('./models/Document');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/plakplek', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

// Sets ExpressJS to use EJS as the view engine
let ejs = require('ejs');
app.set('view engine', 'ejs');

// Get from body
app.use(express.urlencoded({ extended: true }));

// Use public as static folder
app.use(express.static('public'));

// Frontpage
app.get('/', (req, res) => {
  const code = `Welkom op plakplek!

Een plek om tekstbestanden te delen met je vrienden, alsof het 1983 is!`;
  res.render('index', { code, language: 'plaintext' });
});

// New text
app.get('/new', (req, res) => {
  res.render('new');
});

app.post('/save', async (req, res) => {
  const value = req.body.value;
  const time = new Date().toLocaleString();
  try {
    const document = await Document.create({ value, time });
    res.redirect(`/${document.id}`);
  } catch (e) {
    res.render('new', { value, time });
  }
});

app.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const document = await Document.findById(id);
    res.render('document', { code: document.value, time: document.time, id });
  } catch (e) {
    res.redirect('/');
  }
});

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(process.env.PORT || port, () => {
  console.log(`Plakplek is running and listening on port ${port}`);
});
