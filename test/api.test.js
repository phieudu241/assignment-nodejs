const chai = require('chai');
const should = chai.should();

describe('API', () => {
    // TODO: Test cases here
    describe('/Demo test case', () => {
        it('should be true', (done) => {
            let temp = 1;
            temp.should.be.eql(1);
            done();
        });
    });
});