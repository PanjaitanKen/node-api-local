const request = require('supertest');
const app = require('../../');

var token = '$2y$12$YVwznP6BkSevltSe/d64l.MEQPf/tnNR4Rax1kG.8RCKD7iC.OEJa';
describe('POST /getbpjsinfo', function () {
  it('responds with json', function (done) {
    request(app)
      .post('/mmf/api/getBPJSInfo')
      .send({ employee_id: '0053722' })
      .set('API_KEY', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        return done();
      });
  });
});
