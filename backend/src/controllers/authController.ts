import { Request, Response } from "express";
import { AuthService } from "../services/authService";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;

      // Validate input
      if (!username || !password) {
        res.status(400).json({
          success: false,
          message: "Username and password are required",
        });
        return;
      }

      if (username.length < 3) {
        res.status(400).json({
          success: false,
          message: "Username must be at least 3 characters long",
        });
        return;
      }

      if (password.length < 6) {
        res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters long",
        });
        return;
      }

      const result = await this.authService.register(username, password);

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          user: {
            _id: result.user._id,
            id: result.user._id,
            username: result.user.username,
            createdAt: result.user.createdAt,
          },
          token: result.token,
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : "Registration failed",
      });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;

      // Validate input
      if (!username || !password) {
        res.status(400).json({
          success: false,
          message: "Username and password are required",
        });
        return;
      }

      const result = await this.authService.login(username, password);

      res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          user: {
            _id: result.user._id,
            id: result.user._id,
            username: result.user.username,
            createdAt: result.user.createdAt,
          },
          token: result.token,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(401).json({
        success: false,
        message: error instanceof Error ? error.message : "Login failed",
      });
    }
  }

  async verifyToken(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");

      if (!token) {
        res.status(401).json({
          success: false,
          message: "No token provided",
        });
        return;
      }

      const decoded = await this.authService.verifyToken(token);

      res.status(200).json({
        success: true,
        message: "Token is valid",
        data: {
          userId: decoded.userId,
        },
      });
    } catch (error) {
      console.error("Token verification error:", error);
      res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
  }
}
