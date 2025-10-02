import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/userRepository";
import { IUser } from "../models/User";
import { config } from "../config/environment";

export class AuthService {
  private userRepository: UserRepository;
  private jwtSecret: string;

  constructor() {
    this.userRepository = new UserRepository();
    this.jwtSecret = config.JWT_SECRET;
  }

  async register(
    username: string,
    password: string
  ): Promise<{ user: IUser; token: string }> {
    try {
      const existingUser = await this.userRepository.findByUsername(username);
      if (existingUser) {
        throw new Error("Username already exists");
      }

      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      const user = await this.userRepository.create({
        username,
        passwordHash,
      });

      const token = this.generateToken((user._id as any).toString());

      return { user, token };
    } catch (error) {
      throw new Error(`Registration failed: ${error}`);
    }
  }

  async login(
    username: string,
    password: string
  ): Promise<{ user: IUser; token: string }> {
    try {
      const user = await this.userRepository.findByUsername(username);
      if (!user) {
        throw new Error("Invalid credentials");
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        throw new Error("Invalid credentials");
      }

      const token = this.generateToken((user._id as any).toString());

      return { user, token };
    } catch (error) {
      throw new Error(`Login failed: ${error}`);
    }
  }

  private generateToken(userId: string): string {
    return jwt.sign({ userId }, this.jwtSecret, { expiresIn: "24h" });
  }

  async verifyToken(token: string): Promise<{ userId: string }> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as { userId: string };
      return decoded;
    } catch (error) {
      throw new Error("Invalid token");
    }
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
