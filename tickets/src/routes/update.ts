import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, NotFound, validateRequest, NotAuthorizedError, BadRequestError } from '@ticketingauth/common';
import { Ticket } from '../models/tickets';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put('/api/tickets/:id',
  requireAuth,
  [
    body('title')
      .not()
      .isEmpty()
      .withMessage('title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('price is invalid or empty')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title , price } = req.body;

    const ticket = await Ticket.findById(req.params.id);

    if(!ticket){
      throw new NotFound();
    }

    if(ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    if(ticket.orderId) {
      throw new BadRequestError('Cannot Edit a reserved ticket');
    }

    ticket.set({
      title,
      price,
    })
    await ticket.save();
    await new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    })

    res.status(202).send(ticket);
})

export { router as updateTicketRouter };