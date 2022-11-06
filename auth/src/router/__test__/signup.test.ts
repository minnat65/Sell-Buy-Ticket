import request from "supertest";
import { app } from "../../app";

it('Returns a 201 on successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.in',
      password: "password"
    })
    .expect(201);
});

it('Returns 400 when invalid email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'testjssin',
      password: "password"
    })
    .expect(400);
})

it('Returns 400 when invalid password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@jss.in',
      password: "p"
    })
    .expect(400);
})

it('Returns 400 with missing email or password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@jss.in',
    })
    .expect(400);

  await request(app)
    .post('/api/users/signup')
    .send({
      password: 'test233',
    })
    .expect(400);
});

it('Disallow duplicate signup with same email', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.in',
      password: "password"
    })
    .expect(201);

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.in',
      password: "password"
    })
    .expect(400);
});

it('set a cookie after successfull signup', async () => {
  const res = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'testwdc111@test.in',
      password: "password"
    })
    .expect(201)

  expect(res.get('Set-Cookie')).toBeDefined();
})