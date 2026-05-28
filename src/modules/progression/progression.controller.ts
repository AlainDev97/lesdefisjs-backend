import type { Request, Response } from "express";
import { getUserProgressionService } from "./progression.service";

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
