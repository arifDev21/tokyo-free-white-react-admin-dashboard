import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/authService";

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
      return;
    }

    const token = authHeader.split(" ")[1]; // lebih aman daripada substring
    const authService = new AuthService();

    const decoded = await authService.verifyToken(token);

    if (!decoded || !decoded.userId) {
      res.status(401).json({
        success: false,
        message: "Access denied. Invalid token payload.",
      });
      return;
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({
      success: false,
      message: "Access denied. Invalid or expired token.",
    });
  }
};
