import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { getMyProgressionController } from "./progression.controller";

const progressionRouter = Router();

progressionRouter.get("/me", authMiddleware, getMyProgressionController);

export default progressionRouter;
