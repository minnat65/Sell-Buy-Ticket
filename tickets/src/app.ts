import 'express-async-errors';
import express from "express";
import { json } from "body-parser";
import cookieSession from 'cookie-session';
import { errorhandler, NotFound, CurrentUser } from '@ticketingauth/common';
import { createTicketsRouter } from './routes/new';
import { showTicketRouter } from './routes/show';
import { indexticketRouter } from './routes';
import { updateTicketRouter } from './routes/update';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false, // disabled cookie encryption
    secure: process.env.NODE_ENV !== 'test', // only https request
  })
)

app.use(CurrentUser);

app.use(createTicketsRouter);
app.use(showTicketRouter);
app.use(indexticketRouter);
app.use(updateTicketRouter);

app.use('*', async () => {
  throw new NotFound()
})

app.use(errorhandler);

export { app };
