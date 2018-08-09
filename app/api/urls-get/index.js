const config = require('config');
const URLShorten = require('../../models/url-shorten');
const APIHelper = require('../../utils/api-helper');

class URLGet {
    static validateRequest(req) {
        req.checkQuery('shortened_url', 'shortened_url is not valid URL').isURL();

        return req.getValidationResult();
    }

    static async handleRequest(req, res) {
        let errors = await URLGet.validateRequest(req);
        if (!errors.isEmpty()) {
            res.status(400).json({errors: errors.array()});
            return;
        }

        let {shortened_url} = req.query;
        let parsedUrl = APIHelper.parseShortenedURL(shortened_url);

        if (!isValidShortenUrl(parsedUrl)) {
            res.status(404).json({error: {msg: 'Shortened URL not found'}});
            return;
        }

        let urlShorten = await URLShorten.findOne({url_code: parsedUrl.urlCode, region: parsedUrl.region});
        if (!urlShorten) {
            res.status(404).json({error: {msg: 'Shortened URL not found'}});
        } else {
            res.json({
                full_url: urlShorten.user_url,
                region: urlShorten.region
            });
        }
    }
}

function isValidShortenUrl(parsedUrl) {
    return (config.get('supported_regions').includes(parsedUrl.region) && config.get('shorten_base_url') === parsedUrl.shortenBaseUrl && parsedUrl.urlCode);
}

module.exports = URLGet;