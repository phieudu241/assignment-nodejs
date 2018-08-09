const url = require('url');

function parseShortenedURL(shortenedUrl) {
    const shortenedUrlObj = url.parse(shortenedUrl);
    let region = shortenedUrlObj.host.split('.')[0];
    let shortenBaseUrl = shortenedUrlObj.host.substring(shortenedUrlObj.host.indexOf('.') + 1);
    let urlCode = shortenedUrlObj.pathname.substring(1);

    return {region, shortenBaseUrl, urlCode};
}

module.exports = {
    parseShortenedURL
};