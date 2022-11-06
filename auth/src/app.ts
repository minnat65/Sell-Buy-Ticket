import 'express-async-errors';
import express from "express";
import { json } from "body-parser";

import cookieSession from 'cookie-session';

import { currentUserRouter } from './router/current-user';
import { singInRouter } from './router/signin';
import { singOutRouter } from './router/signout';
import { singUpRouter } from './router/signup';
import { errorhandler, NotFound } from '@ticketingauth/common';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false, // disabled cookie encryption
    secure: process.env.NODE_ENV !== 'test', // only https request
  })
)

app.use(currentUserRouter);
app.use(singInRouter);
app.use(singOutRouter);
app.use(singUpRouter);

app.use('*', async () => {
  throw new NotFound()
})

app.use(errorhandler);

export { app };
