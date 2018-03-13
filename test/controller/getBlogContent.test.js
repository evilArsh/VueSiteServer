'use strict';
const { app /* mock, assert*/ } = require('egg-mock/bootstrap');
describe('test/controller/getBlogContent.test.js', () => {
  describe('GET /api/blog', () => {
    it('get blog content', () => {
      // 模拟csrfToken
      app.mockCsrf();
      // const ctx = app.mockContext();
      return app.httpRequest()
        .get('/api/blog')
        //.type('application/json')
       // .send({ userMail: '13521389587@qq.com', userPassword: 'test' })
        .expect(200)
        .expect('hello world');
    });
  });
});
