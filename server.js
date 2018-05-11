const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 80;
var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;

  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server.log.');
    }
  });
  next();
});

app.use((req, res, next) => {
  if (req.url === '/maintenance') {
    res.render('maintenance.hbs');
  } else {
    next();
  }
});

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'About Page',
    welcomeMessage: 'Welcome to my site!'
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page'
  });
});

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to fullfill request.'
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});

