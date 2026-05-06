'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api.js');

const app = express();

app.use('/public', express.static(process.cwd() + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.route('/').get((req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

apiRoutes(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Listening on port ' + PORT);
});

module.exports = app;