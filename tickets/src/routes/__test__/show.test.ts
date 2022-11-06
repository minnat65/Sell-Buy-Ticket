import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('return 404 if ticket not found by id', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .get(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({})
    .expect(404);
})

it('return 200 if a tickets found by id.', async () => {
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'fuyfejhbkcsx',
      price: 78,
    })
    .expect(201);

  await request(app)
    .get(`/api/tickets/${res.body.id}`)
    .set('Cookie', global.signin())
    .send({})
    .expect(200);
});