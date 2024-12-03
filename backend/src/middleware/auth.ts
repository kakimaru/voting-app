import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  console.log('Cookies received:', req.cookies);

  const token = req.cookies.jwt;

  if (!token) {
    res.status(403).json({ message: 'Access denied' });
    return;
  }
  jwt.verify(token, process.env.JWT_SECRET!, (err: Error | null, decoded: any) => {
    if (err) {
      console.error('Error verifying token:', err.message);
      return res.status(403).json({ message: 'Invalid token' });
    }

    console.log('Token decoded successfully:', decoded);
    req.user = decoded;
    next();
  });
};

export default authenticateToken;
