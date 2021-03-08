const request = require('supertest');
const app = require('../../controller/getBPJSInfoCtrl');
describe('POST /getbpjsinfo', function() {
  it('responds with json', function(done) {
    request(app)
      .post('/mmf/api/getBPJSInfo')
      .send({ employee_id: '0053722' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        return done();
      });
  });
});