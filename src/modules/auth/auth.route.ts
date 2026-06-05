import { Router } from "express";
import {
  loginController,
  meController,
  registerController,
  logoutController,
} from "./auth.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const authRouter = Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);
authRouter.get("/me", authMiddleware, meController);
authRouter.post("/logout", authMiddleware, logoutController);
export default authRouter;
