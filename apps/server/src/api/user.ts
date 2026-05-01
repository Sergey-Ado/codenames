import express from 'express';
import type { Request, Response } from 'express';
import { userData } from './userData.ts';

const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  const response = await new Promise(resolve => {
    const result = userData;
    setTimeout(() => resolve(result), 300);
  });
  res.json(response);
};

const userRouter = express.Router();

userRouter.get('/', getAllUsers);

export { userRouter };
