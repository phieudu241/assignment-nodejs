const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/', function (req, res) {
    res.send('URL Shortener API');
});

router.route('/urls')
    .post(getHandler('urls', 'post'));

function getHandler(name, method) {
    let dirName = `${name}${method ? '-' + method : ''}`;
    let fullPath = `./${path.join('app/api', dirName)}`;
    let handler = require(fullPath);
    return handler.handleRequest;
}

module.exports = router;
