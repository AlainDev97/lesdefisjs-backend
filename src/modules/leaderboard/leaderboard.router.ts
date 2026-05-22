import { Router } from "express";
import { getLeaderboardController } from "./leaderboard.controller";

const leaderboardRouter = Router();

leaderboardRouter.get("/", getLeaderboardController);

export default leaderboardRouter;
