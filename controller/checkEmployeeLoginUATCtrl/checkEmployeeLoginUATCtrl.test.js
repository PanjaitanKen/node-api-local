const request = require('supertest');
const app = require("../..");
const pool = require('../../db');

describe('POST /checkEmployeeLoginUAT',() => {
  it('responds with json', async () => {
    const res = await request(app)
      .post('/hcm/api/checkEmployeeLoginUAT')
      .send({
        "employee_id": "0002738"
        })
      .set('API_KEY','$2y$12$YVwznP6BkSevltSe/d64l.MEQPf/tnNR4Rax1kG.8RCKD7iC.OEJa')
      // .expect('Content-Type', 'application/json; charset=utf-8')
      expect(res.statusCode).toEqual(200)
  });
});
