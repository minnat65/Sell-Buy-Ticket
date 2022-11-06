import express, { Request, Response} from "express";
import { body } from "express-validator";
import { validateRequest, BadRequestError } from "@ticketingauth/common";
import jwt from 'jsonwebtoken';

import { User } from "../models/user";
import { Password } from "../services/password";

const router = express.Router();

router.post('/api/users/signin',
  [
    body('email')
      .isEmail()
      .withMessage('Email is Invalid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Password is a required field')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if(!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    const passwordMatch = await Password.compare(existingUser.password, password);

    if(!passwordMatch) {
      throw new BadRequestError('Invalid credentials');
    }

    const userJWT = jwt.sign({ 
      id: existingUser.id, email: existingUser.email
    },
      process.env.JWT_KEY!  // ! means we have make sure that this variable will be there
    );

    // store it in session object
    req.session = {
      jwt: userJWT,
    }

    res.status(200).send(existingUser);
});

export { router as singInRouter };