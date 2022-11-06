import request from "supertest";
import { app } from '../../app';
import { Ticket } from '../../models/tickets';
import { natsWrapper } from '../../nats-wrapper';

it('has a POST route of /api/tickets', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .send({})

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if user is signin', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .send({});

  expect(response.status).toEqual(401);
});

it('returns other than 401 when user is signed in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it('returns an error if invalid title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: '',
      price: 10
    })
    .expect(400)

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      price: 10
    })
    .expect(400)
});

it('returns an error if invalid price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'wfejf',
      price: -10
    })
    .expect(400)
  
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      titile: 'ijfehf'
    })
    .expect(400)
});

it('creates a ticket with valid params', async () => {
  let tickets = await Ticket.find();
  expect(tickets.length).toEqual(0);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'fuyfejhbkcsx',
      price: 78,
    })
    .expect(201);

  tickets = await Ticket.find();
  expect(tickets.length).toEqual(1);
});

it('published an event', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'fuyfejhbkcsx',
      price: 78,
    })
    .expect(201);
  
  expect(natsWrapper.client.publish).toHaveBeenCalled();
})