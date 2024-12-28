import { Request, Response, NextFunction } from "express";

const allowedOrigins = ["http://localhost:4321", "https://votingapp-seven.vercel.app"];

const corsMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  } else {
    console.warn(`Origin not allowed by CORS: ${origin}`);
  }

  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");

  // if (req.method === "OPTIONS") {
  //   return res.sendStatus(204); // No Content
  // }

  next();
};

export default corsMiddleware;
