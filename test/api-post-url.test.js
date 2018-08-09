process.env.NODE_ENV = 'test';

const URLShorten = require('../app/models/url-shorten');
const shortid = require("shortid");
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const server = require('../server');
const BASE_URL = '/api/v1';
chai.use(chaiHttp);


describe('API TEST', () => {
    //Before each test we empty the database
    beforeEach((done) => {
        URLShorten.remove({}, (err) => {
            done();
        });
    });

    describe('/POST url', () => {
        it('it should not POST a url without user_url field', (done) => {
            let url = {
                region: "eu"
            };
            chai.request(server)
                .post(`${BASE_URL}/urls`)
                .send(url)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    done();
                });
        });

        it('it should not POST a url without region field', (done) => {
            let url = {
                user_url: "http://example.com"
            };
            chai.request(server)
                .post(`${BASE_URL}/urls`)
                .send(url)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    done();
                });
        });

        it('it should not POST a url with an invalid URL', (done) => {
            let url = {
                user_url: "invalid URL",
                region: "eu"
            };
            chai.request(server)
                .post(`${BASE_URL}/urls`)
                .send(url)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    done();
                });
        });

        it('it should not POST a url with an unsupported region', (done) => {
            let url = {
                user_url: "http://example.com",
                region: "invalid region"
            };
            chai.request(server)
                .post(`${BASE_URL}/urls`)
                .send(url)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    done();
                });
        });

        it('it should not POST a url with a duplicate user_url', async (done) => {
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
                .post(`${BASE_URL}/urls`)
                .send(url)
                .end((err, res) => {
                    res.should.have.status(409);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    done();
                });
        });

        it('it should POST a valid url', (done) => {
            let url = {
                user_url: "http://example.com",
                region: "eu"
            };
            chai.request(server)
                .post(`${BASE_URL}/urls`)
                .send(url)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('shortened_url');
                    done();
                });
        });
    });
});
