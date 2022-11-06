import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { OrderStatus } from "@ticketingauth/common";
import { TicketDoc } from "./ticket";

interface OrderAttr {
  userId: string,
  status: OrderStatus,
  expiresAt: Date,
  ticket: TicketDoc,
}

interface OrderDoc extends mongoose.Document {
  userId: string,
  status: OrderStatus,
  expiresAt: Date,
  ticket: TicketDoc,
  version: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttr): OrderDoc
}

const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: Object.values(OrderStatus),
    default: OrderStatus.Created,
  },
  expiresAt: { type: mongoose.Schema.Types.Date },
  ticket: { type: mongoose.Types.ObjectId, ref: 'Ticket'}
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
});

OrderSchema.set('versionKey', 'version');
OrderSchema.plugin(updateIfCurrentPlugin);

OrderSchema.statics.build = (attrs: OrderAttr) => {
  return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', OrderSchema);

export { Order };