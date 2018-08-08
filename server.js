const express = require('express');
const app = express();
const port = 8011;
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require('./router');

// Router
app.use('/', router);

// Third party
app.use(expressValidator());
app.use(bodyParser.json());
app.use(cors());

// App configurations
app.set('port', (process.env.PORT || port));

app.listen(port, function () {
    console.log(`URL Shortener API is running on port: ${app.get('port')}`);
});
