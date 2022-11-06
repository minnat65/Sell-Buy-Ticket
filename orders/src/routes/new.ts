import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { requireAuth, validateRequest, NotFound, OrderStatus, BadRequestError } from '@ticketingauth/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const EXPIREATION_WINDOW = 15 * 60;

router.post('/api/orders', requireAuth, [
  body('ticketId')
  .not()
  .isEmpty()
  .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
  .withMessage('ticketId is required.')
],
validateRequest,
 async (req: Request, res: Response) => {
  const { ticketId } = req.body;
  // Find the tickets
  const ticket = await Ticket.findById(ticketId);

  if(!ticket) {
    throw new NotFound();
  }

  const isReserved = await ticket.isReserved();

  // Throw Error if existingOrder found.
  // It means Someone trying to buy this ticket therefore we cannot allow others to buy it.
  if(isReserved) {
    throw new BadRequestError('Ticket is already reserved.')
  }

  const expiration = new Date();
  expiration.setSeconds(expiration.getSeconds() + EXPIREATION_WINDOW);

  const order = Order.build({
    userId: req.currentUser!.id,
    status: OrderStatus.Created,
    expiresAt: expiration,
    ticket,
  });
  
  await order.save();

  // TODO: publish an event
  await new OrderCreatedPublisher(natsWrapper.client).publish({
    id: order.id,
    status: order.status,
    version: order.version,
    userId: order.userId,
    expiresAt: order.expiresAt.toISOString(),
    ticket: {
      id: ticket.id,
      price: ticket.price,
    }
  });

  res.status(201).send(order);
});

export { router as newOrderRouter };
