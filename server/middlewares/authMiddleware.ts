import { Request, Response, NextFunction,RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

export const authenticate: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization');

  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const tokenWithoutBearer = token.slice(7);
  try {
    const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET as string) as { userId: string };
    res.locals.userId = decoded.userId;
    next(); 
  } catch (error) {
    console.error('Token validation error', error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
