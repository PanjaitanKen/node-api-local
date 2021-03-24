const request = require('supertest');
const app = require('../..');
const pool = require('../../db');

describe('POST /checkTokenNotif', () => {
  it('responds with json', async () => {
    const res = await request(app)
      .post('/hcm/api/checkTokenNotif')
      .send({
        employee_id: '0053722',
        token_notif:
          'eN03St2nRSWcRr8k331dmL:APA91bGcb4hEQQhOyC_aUcxwL3q-CwQ3vOEfT_B9DgnRYyujCTXIEPb9WUsnGzno-j26EDsrM2Ik11U1N_jIDnKTS7EkqJ36rm6o6-HdCL2q40_kInZivB_6Rgewc814I43wW0Q7icXf',
      })
      .set(
        'API_KEY',
        '$2y$12$YVwznP6BkSevltSe/d64l.MEQPf/tnNR4Rax1kG.8RCKD7iC.OEJa'
      );
    // .expect('Content-Type', 'application/json; charset=utf-8')
    expect(res.statusCode).toEqual(202);
  });
});
