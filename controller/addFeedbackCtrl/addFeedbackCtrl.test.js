// const request = require('supertest');
// const app = require("../..");
// const pool = require('../../db');

// describe('POST /addfeedback',() => {
//   it('responds with json', async () => {
//     const res = await request(app)
//       .post('/hcm/api/addfeedback')
//       .send({ 
//         "employee_id" : "0002738", 
//         "id_kategori_komplain" : "39", 
//         "information_data" : "testing cc no email", 
//         "id_session"  : "123",
//         "number_phone" : "012992912"
//         })
//       .set('API_KEY','$2y$12$YVwznP6BkSevltSe/d64l.MEQPf/tnNR4Rax1kG.8RCKD7iC.OEJa')
//       // .expect('Content-Type', 'application/json; charset=utf-8')
//       expect(res.statusCode).toEqual(200)
//   });
// });
