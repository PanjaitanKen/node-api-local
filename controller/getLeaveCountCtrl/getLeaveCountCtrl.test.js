const request = require('supertest');
const app = require("../..");
const pool = require('../../db');

describe('POST /getLeaveCount',() => {
  it('responds with json', async () => {
    const res = await request(app)
      .post('/mmf/api/getLeaveCount')
      .send(
            {
              "employee_id": "0002738",
              "leave_date_from": "04/02/2021",
              "leave_date_to": "06/02/2021"
            }
          )
      .set('API_KEY','$2y$12$YVwznP6BkSevltSe/d64l.MEQPf/tnNR4Rax1kG.8RCKD7iC.OEJa')
      // .expect('Content-Type', 'application/json; charset=utf-8')
      expect(res.statusCode).toEqual(200)
  });
});
