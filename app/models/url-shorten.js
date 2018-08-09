const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let URLShortenSchema = new Schema(
    {
        region: {type: String, required: true},
        user_url: {type: String, required: true},
        url_code: {type: String, required: true},
        created_at: {type: Date, default: Date.now},
        modified_at: {type: Date, default: Date.now}
    }
);

module.exports = mongoose.model('URLShorten', URLShortenSchema);