import { Publisher, Subjects, TicketCreatedEvent } from '@ticketingauth/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
  readonly subject = Subjects.TicketCreated;
}