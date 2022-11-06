import express, { Request, Response } from 'express';
import { requireAuth, NotFound } from '@ticketingauth/common';
import { Ticket } from '../models/tickets';

const router = express.Router();

router.get('/api/tickets/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const tickets = await Ticket.findById(req.params.id);

    if(!tickets){
      throw new NotFound();
    }

    res.status(200).send(tickets);
})

export { router as showTicketRouter };