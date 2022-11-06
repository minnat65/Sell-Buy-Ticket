import { Publisher, Subjects, TicketUpdatedEvent } from "@ticketingauth/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}