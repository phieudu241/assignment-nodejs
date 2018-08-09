process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
const port = 8011;

const config = require('config');
const express = require('express');
const app = express();
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const router = require('./router');
const BASE_URL = '/api/v1';

// DB connection
mongoose.connect(config.get('database.url'), { useNewUrlParser: true });
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

// Third party
app.use(bodyParser.json());
app.use(expressValidator());
app.use(cors());

// Router
app.use(BASE_URL, router);

// App configurations
app.set('port', (process.env.PORT || port));

app.listen(app.get('port'), function () {
    console.log(`URL Shortener API is running on port: ${app.get('port')}`);
});

module.exports = app;
