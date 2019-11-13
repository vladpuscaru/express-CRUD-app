'use strict'
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dataFunctions = require('./assets/lib/dataFunctions');
const path = require('path');

const PORT = 8080;
const FILE_PATH = './assets/files/objects.json';

// Setup
app.use(bodyParser.urlencoded({ extended: false }))
app.locals.data = dataFunctions.read(FILE_PATH);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
  res.status(200).render('actions', {data: app.locals.data});
});

app.get('/read', (req, res) => {
  console.log(app.locals.data);
  res.status(201).render('read', {data: app.locals.data});
});

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

  // construct the new JSON
  const json = {
    persons: app.locals.data.persons
  }

  // write new person to file (database) async
  dataFunctions.writeAsync(FILE_PATH, json);

  // redirect user to the READ page
  res.status(301).redirect('/read');
});


// Start server
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

