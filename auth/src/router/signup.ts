import express, { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { body } from "express-validator";
import { User } from "../models/user";
import { BadRequestError, validateRequest } from "@ticketingauth/common";

const router = express.Router();

router.post('/api/users/signup', [
  body('email')
    .isEmail()
    .withMessage('Email must be valid'),
  body('password')
    .trim()
    .isLength({ min: 4, max: 20})
    .withMessage('Password must be min 4 & max 20 length')
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if(existingUser) {
      throw new BadRequestError('User already exist with this email')
    }

    const user = User.build({ email, password });
    await user.save();

    // Generate web token
    const userJWT = jwt.sign({ 
      id: user.id, email: user.email
    },
      process.env.JWT_KEY!  // ! means we have make sure that this variable will be there
    );

    // store it in session object
    req.session = {
      jwt: userJWT,
    }

    res.status(201).send(user);
});

export { router as singUpRouter };