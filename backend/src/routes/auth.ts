import { Router } from "express";
import { AuthController } from "../controllers/authController";

const router = Router();
const authController = new AuthController();

// POST /auth/register
router.post("/register", async (req, res) => {
  await authController.register(req, res);
});

// POST /auth/login
router.post("/login", async (req, res) => {
  await authController.login(req, res);
});

// GET /auth/verify
router.get("/verify", async (req, res) => {
  await authController.verifyToken(req, res);
});

export default router;
