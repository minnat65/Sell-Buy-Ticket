import { Publisher, Subjects, OrderCreatedEvent } from '@ticketingauth/common';

// Publisher is a generic class. generic class??
export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}