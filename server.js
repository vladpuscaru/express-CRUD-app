'use strict'
const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const dataFunctions = require('./assets/lib/dataFunctions');
const path = require('path');

const PORT = 8080;
const FILE_PATH = './assets/files/objects.json';

// Setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ 
  secret: 'status message',
  resave: false,
  saveUninitialized: true
}));
app.locals.data = dataFunctions.read(FILE_PATH);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
  res.status(200).render('actions', {data: app.locals.data});
});

// CREATE
app.post('/new', (req, res) => {
  const name = req.body.name;
  const age = parseInt(req.body.age);
  const occupation = req.body.occupation;
  const friends = req.body.friends.split(',');

  let newPerson = {
    name: name,
    age: age,
    occupation: occupation,
    friends: friends
  };

  // add new person to locals
  app.locals.data.persons.push(newPerson);

  // update the message
  req.session.message = `Person ${newPerson.name} was succesfully added!`;

  // write new person to file (database) async
  dataFunctions.writeAsync(FILE_PATH, app.locals.data, true);

  // redirect user to the READ page
  res.status(301).redirect('/read');
});

// READ
app.get('/read', (req, res) => {
  console.log(req.session);
  res.status(201).render('read', {data: app.locals.data, statusMessage: req.session.message});
});

// UPDATE
app.post('/update', (req, res) => {
  
  res.status(302).redirect('/read');
});

// DELETE
app.post('/delete', (req, res) => {
  let status;

  const nameDelete = req.body.nameDelete;

  let array = [...app.locals.data.persons];
  let index = array.map(person => person.name).indexOf(nameDelete);

  if (index >= 0) {
    array.splice(index, 1);
    app.locals.data.persons = array;
    // write new person to file (database) async
    dataFunctions.writeAsync(FILE_PATH, app.locals.data, false);
    status = 303;
    req.session.message = `Person ${nameDelete} was succesfully removed!`;
  } else {
    status = 404;
    req.session.message = `Person ${nameDelete} was not found!`;
  }

  res.status(status).redirect('/read');
});




// Start server
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

