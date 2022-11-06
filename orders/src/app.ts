import 'express-async-errors';
import express from "express";
import { json } from "body-parser";
import cookieSession from 'cookie-session';
import { errorhandler, NotFound, CurrentUser } from '@ticketingauth/common';

import { deleteOrderRouter } from './routes/delete';
import { indexOrderRouter } from './routes/index';
import { newOrderRouter } from './routes/new';
import { showOrderRouter } from './routes/show';

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

app.use(deleteOrderRouter);
app.use(indexOrderRouter);
app.use(newOrderRouter);
app.use(showOrderRouter);


app.use('*', async () => {
  throw new NotFound()
})

app.use(errorhandler);

export { app };
