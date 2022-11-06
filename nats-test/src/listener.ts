import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './events/ticket-created-listener';

console.clear();

// second argument is clientId, randomBytes(4).toString('hex')
// this will create random clientId, we will be able to avoid duplicate id & can run multiple instances of this services
const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222'
});

stan.on('connect', () => {
  console.log('Listener connected to NATS.');

  stan.on('close', () => {
    console.log('NATS connection closed!');
    process.exit();
  })

  new TicketCreatedListener(stan).listen()
  // Code from line 21 to 41 has gone to Listener class
  // const options = stan.subscriptionOptions()
  //   .setManualAckMode(true) // Now Manually we have to tell NATS that this was successfull, NATS will not acknowledge then NATS will retry this event again & again after some time
  //   .setDeliverAllAvailable()
  //   .setDurableName('order-service');

  // subcribed to an channel called "ticket:created"
  // const subscription = stan.subscribe(
  //   'ticket:created',
  //   'order-service-queue-group',
  //   options,
  //   );

  // subscription.on('message', (msg: Message) => {
  //   const data = msg.getData();

  //   if (typeof data === 'string') {
  //     console.log(`Message recieved #${msg.getSequence()} with data ${data}`);
  //   }
    
  //   msg.ack();
  // })
})

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());


