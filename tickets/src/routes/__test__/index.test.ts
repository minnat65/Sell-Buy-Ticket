import request from 'supertest';
import { app } from '../../app';

const createTicket = () => {
  return request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'fuyfejhbkcsx',
      price: 78,
    })
    .expect(201);
}

it('get all the tickets', async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const response = await request(app)
    .get('/api/tickets')
    .send({})
    .expect(200);

  expect(response.body.length).toEqual(3);
});