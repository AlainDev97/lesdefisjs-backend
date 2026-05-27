import type { Request, Response } from "express";
import { getUserBadgesService } from "./badges.service";

export async function getMyBadgesController(
  request: Request,
  response: Response,
) {
  const userId = request.user!.id;

  const badges = await getUserBadgesService(userId);

  return response.status(200).json({
    badges,
  });
}