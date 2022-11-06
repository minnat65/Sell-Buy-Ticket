import express, { Request, Response } from "express";
import { CurrentUser } from "@ticketingauth/common";

const router = express.Router();

router.get('/api/users/currentuser', CurrentUser,
  (req: Request, res: Response) => {
    res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };