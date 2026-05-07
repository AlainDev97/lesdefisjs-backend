import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  createChallenge,
  deleteChallenge,
  getAllChallenges,
  getChallengeById,
  getChallengeBySlug,
  updateChallenge,
} from "./challenges.service";

type Params = {
  id: string;
};

type SlugParams = {
  slug: string;
};

export const createChallengeController = asyncHandler(
  async (req: Request<Params>, res: Response) => {
    const challenge = await createChallenge(req.body);

    res.status(201).json({
      message: "Challenge created successfully",
      data: challenge,
    });
  },
);

export const getAllChallengesController = asyncHandler(
  async (_req: Request<Params>, res: Response) => {
    const challenges = await getAllChallenges();

    res.status(200).json({
      data: challenges,
    });
  },
);

export const getChallengeByIdController = asyncHandler(
  async (req: Request<Params>, res: Response) => {
    const challenge = await getChallengeById(req.params.id);

    res.status(200).json({
      data: challenge,
    });
  },
);

export const getChallengeBySlugController = asyncHandler(
  async (req: Request<SlugParams>, res: Response) => {
    const challenge = await getChallengeBySlug(req.params.slug);

    res.status(200).json({
      data: challenge,
    });
  },
);

export const updateChallengeController = asyncHandler(
  async (req: Request<Params>, res: Response) => {
    const challenge = await updateChallenge(req.params.id, req.body);

    res.status(200).json({
      message: "Challenge updated successfully",
      data: challenge,
    });
  },
);

export const deleteChallengeController = asyncHandler(
  async (req: Request<Params>, res: Response) => {
    const result = await deleteChallenge(req.params.id);

    res.status(200).json(result);
  },
);
