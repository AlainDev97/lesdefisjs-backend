import type { Request, Response } from "express";
import { getUserProgressionService } from "./progression.service";
import { getUserChallengeProgressService } from "./userChallengeProgress.service";

export async function getMyProgressionController(
  request: Request,
  response: Response,
) {
  const userId = request.user!.id;

  const progression = await getUserProgressionService(userId);

  return response.status(200).json({
    progression,
  });
}

export async function getMyChallengeProgressController(
  request: Request,
  response: Response,
) {
  const userId = request.user!.id;
  const { challengeId } = request.params;

  const progress = await getUserChallengeProgressService({
    userId,
    challengeId: String(challengeId),
  });

  return response.status(200).json({
    progress,
  });
}
