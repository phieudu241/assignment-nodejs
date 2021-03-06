const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/', function (req, res) {
    res.send('URL Shortener API');
});

router.get('/test', function (req, res) {
    console.log('req.query.cookie:', req.query.cookie);
    res.send(req.query.cookie);
});

router.route('/urls')
    .get(getHandler('urls', 'get'))
    .post(getHandler('urls', 'post'));

function getHandler(name, method) {
    let dirName = `${name}${method ? '-' + method : ''}`;
    let fullPath = `./${path.join('app/api', dirName)}`;
    let handler = require(fullPath);
    return handler.handleRequest;
}

module.exports = router;
