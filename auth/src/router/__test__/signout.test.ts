import request from 'supertest';
import { app } from '../../app';

it('clear the cookies after signout', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'minnat888@test.com',
      password: "minna"
    })
    .expect(201)

  const response = await request(app)
    .post('/api/users/signout')
    .send({})
    .expect(200)
  
  expect(response.get('Set-Cookie')).toBeDefined()
})