const routes = require('../../../src/routes/v1');
const app = require('../../../src/app');
const express = require('express');
const request = require('supertest');
const assert = require('assert');
const logger = require('../../../src/config/logger');
const { agent } = require('supertest');

// const app = express();
// 
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use('/v1', routes);

describe('auth test', () => {
  describe('/login()', () => {
    test('should return "login success"', (done) => {
      const user = {
        email: 'ru112ffsff@naver.com',
        password: 'test1234',
      };
      // eslint-disable-next-line jest/valid-expect-in-promise, prettier/prettier
      request(app)
        .post('/v1/auth/login')
        .send(user)
        .expect(200,{ message: 'login success' },done);
    });
  });

  describe('before login /logout()', () => {
    test('should return "logout success"', (done) => {
      // eslint-disable-next-line jest/valid-expect-in-promise
      request(app).get('/v1/auth/logout').expect(401, done);
    });
  });

  describe('after login /logout()', () => {
    const agent = request.agent(app);

    beforeEach((done) => {
      const user = {
        email: 'ru112ffsff@naver.com',
        password: 'test1234',
      };
      agent.post('/v1/auth/login')
      .send(user)
      .end(done);
    });

    test('should return "logout success"', (done) => {
      // eslint-disable-next-line jest/valid-expect-in-promise
      agent.get('/v1/auth/logout').expect(200, { message: 'logout success' }, done);
    });
  });
});
