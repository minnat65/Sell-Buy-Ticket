import { Message } from "node-nats-streaming";
import { Subjects,  Listener, OrderCreatedEvent } from "@ticketingauth/common";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/tickets";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);

    // If no ticket throw error
    if(!ticket) {
      throw new Error('Not Found');
    }

    // Mark the ticket as reserved by setting up orderId property
    ticket.set({ orderId: data.id });

    // save the ticket
    ticket.save();

    // publishing an event bcz other services should know the updates
    // and data will be sync in all services
    await new TicketUpdatedPublisher(this.client).publish({ // await keyword will throw an error if it will failed not ack the msg
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId,
    }); 

    // ack the msg
    msg.ack();
  }
}