import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config(); 
const JWT_SECRET_FROM_ENV = process.env.JWT_PASSWORD;


if (!JWT_SECRET_FROM_ENV) {
  console.warn(
    "WARNING: JWT_PASSWORD environment variable is not set. " +
    "Token verification will fail if this is not configured correctly for the middleware."
  );
}

declare global {
    namespace Express {
      interface Request {
        userId?: string;
      }
    }
  }

export const userMiddleware = (req: Request,res: Response,next:NextFunction): void =>{ 
    const authHeader = req.headers["authorization"];

    if (!authHeader || typeof authHeader !== "string") {
      res.status(401).json({ message: "Authorization header missing or invalid" });
      return;
    }

    const parts = authHeader.split(' ');
    let token: string | undefined;

    if (parts.length === 2 && parts[0].toLowerCase() === "bearer") {
        token = parts[1];
    } else {
        
        token = authHeader;
    }

    if (!token) {
      res.status(401).json({ message: "Token missing or malformed in Authorization header" });
      return;
    }

    
    if (typeof JWT_SECRET_FROM_ENV !== 'string' || JWT_SECRET_FROM_ENV.length === 0) {
        console.error("CRITICAL ERROR in userMiddleware: JWT_SECRET_FROM_ENV is not a valid string. Check environment variables.");
        res.status(500).json({ message: "Internal server configuration error (JWT secret misconfigured)." });
        return; 
    }
   
    try {
        
        const decoded = jwt.verify(token, JWT_SECRET_FROM_ENV) as { id: string, [key: string]: any };
        
        if (!decoded || typeof decoded.id === 'undefined') {
            console.error("JWT decoded but 'id' field is missing:", decoded);
            res.status(401).json({ message: "Invalid token payload (missing id)." });
            return;
        }

        req.userId = decoded.id;
        next();
      } catch (error: any) {
        console.error("JWT verification failed:", error.name, error.message);
        let message = "Invalid or expired token";
        if (error.name === 'TokenExpiredError') {
            message = "Token has expired. Please log in again.";
        } else if (error.name === 'JsonWebTokenError') {
            
            message = "Token is invalid.";
        } else if (error.name === 'NotBeforeError') {
            message = "Token not active yet.";
        }
        res.status(401).json({ message });
       
    }
}
