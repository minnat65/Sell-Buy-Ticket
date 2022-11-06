import { OrderStatus } from '@ticketingauth/common';
import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from "../../nats-wrapper";

it('delete an order', async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 33
  });
  await ticket.save();

  const user = global.signin();
  const order = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .put(`/api/orders/${order.body.id}`)
    .set('Cookie', user)
    .send()
    .expect(204)
  
  const cancelledOrder = await request(app)
    .get(`/api/orders/${order.body.id}`)
    .set('Cookie', user)
    .send()
    .expect(200)
  
  expect(cancelledOrder.body.status).toEqual(OrderStatus.Cancelled);
})

it('emits an order cancelled events', async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 33
  });
  await ticket.save();

  const user = global.signin();
  const order = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .put(`/api/orders/${order.body.id}`)
    .set('Cookie', user)
    .send()
    .expect(204)
  
  const cancelledOrder = await request(app)
    .get(`/api/orders/${order.body.id}`)
    .set('Cookie', user)
    .send()
    .expect(200)
  
  expect(natsWrapper.client.publish).toHaveBeenCalled();
})