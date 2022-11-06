import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';

const buildTicket = async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 23
  });
  await ticket.save();

  return ticket;
}

it('get tickets of a user', async () => {
  // create three tickets
  const ticketOne = await buildTicket();
  const ticketTwo = await buildTicket();
  const ticketThree = await buildTicket();

  const user1 = global.signin();
  const user2 = global.signin();

  // create one Order for user#1
  const order1 = await request(app)
    .post('/api/orders')
    .set('Cookie', user1)
    .send({ ticketId: ticketOne.id})
    .expect(201);
  // create two Order for user#1
  const order2 = await request(app)
    .post('/api/orders')
    .set('Cookie', user2)
    .send({ ticketId: ticketTwo.id})
    .expect(201);

  const order3 = await request(app)
    .post('/api/orders')
    .set('Cookie', user2)
    .send({ ticketId: ticketThree.id})
    .expect(201);
  
  // Make req to get orders of user#2
  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', user2)
    .send({})
    .expect(200)
  
  // Make sure we only get the orders of user#2
  
  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(order2.body.id);
  expect(response.body[1].id).toEqual(order3.body.id);
})