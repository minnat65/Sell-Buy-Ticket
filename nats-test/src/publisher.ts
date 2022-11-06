import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear();

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222'
});

stan.on('connect', async () => {
  console.log('publisher connected to NATS');

  const publisher = new TicketCreatedPublisher(stan);

  try {
    await publisher.publish({
      id: '1234',
      title: 'Testing Event Publish',
      price: 123
    })
  } catch(err) {
    console.error(err);
  }

  // we need to convert plain object into JSON
  // const data = {
  //   id: '56789',
  //   title: 'concert',
  //   price: 21,
  // };

  // publishing an event on channel called "ticket:created"
  // stan.publish('ticket:created', data, () => {
  //   console.log('Event published.');
  // })
})