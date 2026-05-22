import { Request, Response } from "express";
import { getLeaderboardService } from "./leaderboard.service";

export async function getLeaderboardController(req: Request, res: Response) {
  try {
    const leaderboard = await getLeaderboardService();

    return res.status(200).json({
      data: leaderboard,
    });
  } catch {
    return res.status(500).json({
      message: "Erreur serveur lors de la récupération du leaderboard",
    });
  }
}
