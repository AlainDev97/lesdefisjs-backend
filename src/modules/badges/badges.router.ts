import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { getMyBadgesController } from "./badges.controller";

const badgeRouter = Router();

badgeRouter.get("/me", authMiddleware, getMyBadgesController);

export default badgeRouter;
