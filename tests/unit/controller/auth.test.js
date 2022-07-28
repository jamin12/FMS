const auth = require('../../../src/controllers/auth.controller');
const app = require('../../../src/app');
const request = require('supertest');
const assert = require('assert');

describe('auth test', () => {
  describe('#login()', () => {
    it('should return "login success"', (done) => {
      request(app)
        .post('175.197.91.20:53012/v1/auth/login')
        .set('Content-Type', 'application/json')
        .send({
          "email": "ru112ffsff@naver.com",
          "password": "test1234"
        })
        .expect(200)
        .expect('Content-Type', /json/)
    });
  });
});