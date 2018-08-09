process.env.NODE_ENV = 'test';

const URLShorten = require('../app/models/url-shorten');
const shortid = require("shortid");
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const server = require('../server');
const BASE_URL = '/api/v1';
const config = require('config');
chai.use(chaiHttp);


describe('API TEST', () => {
    //Before each test we empty the database
    beforeEach((done) => {
        URLShorten.remove({}, (err) => {
            done();
        });
    });

    describe('/GET url', () => {
        it('it should not GET without shortened url field', (done) => {
            chai.request(server)
                .get(`${BASE_URL}/urls`)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    done();
                });
        });

        it('it should not GET with invalid URL', (done) => {
            chai.request(server)
                .get(`${BASE_URL}/urls?shortened_url=invalid_url`)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    done();
                });
        });

        it('it should not GET with wrong shortened url', (done) => {
            chai.request(server)
                .get(`${BASE_URL}/urls?shortened_url=http://unsupported.${config.get('shorten_base_url')}/AF34GDFg`)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    done();
                });
        });

        it('it should not GET with not existing shortened url', (done) => {
            chai.request(server)
                .get(`${BASE_URL}/urls?shortened_url=http://eu.${config.get('shorten_base_url')}/notExistingCode`)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    done();
                });
        });

        it('it should GET a valid url', async (done) => {
            let url = {
                user_url: "http://example.com",
                region: "eu"
            };

            const item = new URLShorten({
                user_url: url.user_url,
                region: url.region,
                url_code: shortid.generate()
            });
            await item.save();

            chai.request(server)
                .get(`${BASE_URL}/urls?shortened_url=http://${item.region}.${config.get('shorten_base_url')}/${item.url_code}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('full_url').eql(item.user_url);
                    res.body.should.have.property('region').eql(item.region);
                    done();
                });
        });
    });
});
