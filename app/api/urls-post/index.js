const config = require('config');
const shortid = require("shortid");
const URLShorten = require('../../models/url-shorten');

class URLPost {
    static validateRequest(req) {
        req.checkBody('user_url', 'Invalid URL').isURL();
        req.checkBody('region', 'Region is not supported').isIn(config.get('supported_regions'));

        return req.getValidationResult();
    }

    static async handleRequest(req, res) {
        let errors = await URLPost.validateRequest(req);
        if (!errors.isEmpty()) {
            res.status(400).json({errors: errors.array()});
            return;
        }

        let {user_url, region} = req.body;

        // Check user url existing
        let existingUrlShorten = await URLShorten.findOne({user_url: user_url});
        if (existingUrlShorten) {
            res.status(409).json({error: {msg: 'Duplicated URL'}});
        } else {
            // Create new shorten url
            const url_code = shortid.generate();
            const item = new URLShorten({
                region,
                user_url,
                url_code
            });
            await item.save();

            res.json({
                shortened_url: `https://${region}.${config.get('shorten_base_url')}/${url_code}`
            });
        }
    }
}

module.exports = URLPost;