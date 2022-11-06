import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';
import { Ticket } from '../../models/tickets';

it('return 401 if user is not autorized', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'ofiekdfh',
      price: 82
    })
    .expect(401);
});

it('retrns 401 if user does not own the ticket', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'hfejhvndmk',
      price: 678
    })
    .expect(201)

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'ofiekdfh',
      price: 82
    })
    .expect(401);
});

it('return 400 if id prvided does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'ofiekdfh',
      price: 82
    })
    .expect(404);
});

it('return 400 if title or price is invalid', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: '',
      price: 82
    })
    .expect(400);
  
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'uiekjd',
      price: -1
    })
    .expect(400);
});

it('return 202 after successfully update', async () => {
  // const id = new mongoose.Types.ObjectId().toHexString();
  const cookie = global.signin();
  const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', cookie)
    .send({
      title: 'fghjjk',
      price: 82
    })
    .expect(201);
  
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'fghjjk',
      price: 8
    })
    .expect(202);
});

it('published an event', async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', cookie)
    .send({
      title: 'fghjjk',
      price: 82
    })
    .expect(201);
  
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'fghjjk',
      price: 8
    })
    .expect(202);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
})

it('reject an update of reserved ticket', async () => {
  const orderId = new mongoose.Types.ObjectId().toHexString();
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'fghjjk',
      price: 82
    })
    .expect(201)

    const ticket = await Ticket.findById(response.body.id);
    ticket!.set({ orderId });
    await ticket!.save();
     
    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'fghjjk',
      price: 8
    })
    .expect(400);
})
