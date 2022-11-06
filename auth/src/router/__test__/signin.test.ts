import request from "supertest";
import { app } from "../../app";

it('Failed when a user try to login without signup', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'minnat@test.com',
      password: "minna"
    })
    .expect(400);
});

it('Failed when try to sign in with wrong cred', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'minnat888@test.com',
      password: "minna"
    })
    .expect(201)

  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'minnat888@test.com',
      password: "min34a"
    })
    .expect(400)
});

it('Response with cookie when user provie valid cred', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'minnat8@test.com',
      password: "minna"
    })
    .expect(201)

  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'minnat8@test.com',
      password: "minna"
    })
    .expect(200);

    expect(response.get('Set-Cookie')).toBeDefined();
});