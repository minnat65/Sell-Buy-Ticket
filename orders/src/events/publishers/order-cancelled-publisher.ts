import { Publisher, Subjects, OrderCancelledEvent } from '@ticketingauth/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}