import { Request, Response } from "express";
import {
  createSubmissionService,
  getSubmissionByIdService,
  getSubmissionsByChallengeService,
  getSubmissionsByUserService,
} from "./submissions.service";

type Params = {
  id: string;
  challengeId: string;
  userId: string;
};

export async function createSubmissionController(
  req: Request<Params>,
  res: Response,
) {
  try {
    const { userId, challengeId, sourceCode, language } = req.body;

    if (!userId || !challengeId || !sourceCode) {
      return res.status(400).json({
        message: "userId, challengeId et sourceCode sont requis",
      });
    }

    const result = await createSubmissionService({
      userId,
      challengeId,
      sourceCode,
      language,
    });

    return res.status(201).json(result);
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message === "Challenge introuvable" ||
        error.message === "Utilisateur introuvable" ||
        error.message === "Aucun test case trouvé pour ce challenge"
      ) {
        return res.status(404).json({ message: error.message });
      }

      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({
      message: "Erreur serveur lors de la création de la submission",
    });
  }
}

export async function getSubmissionByIdController(
  req: Request<Params>,
  res: Response,
) {
  try {
    const { id } = req.params;
    const submission = await getSubmissionByIdService(id);

    return res.status(200).json(submission);
  } catch (error) {
    if (error instanceof Error && error.message === "Submission introuvable") {
      return res.status(404).json({ message: error.message });
    }

    return res.status(500).json({
      message: "Erreur serveur lors de la récupération de la submission",
    });
  }
}

export async function getSubmissionsByChallengeController(
  req: Request<Params>,
  res: Response,
) {
  try {
    const { challengeId } = req.params;
    const submissions = await getSubmissionsByChallengeService(challengeId);

    return res.status(200).json(submissions);
  } catch {
    return res.status(500).json({
      message:
        "Erreur serveur lors de la récupération des submissions du challenge",
    });
  }
}

export async function getSubmissionsByUserController(
  req: Request<Params>,
  res: Response,
) {
  try {
    const { userId } = req.params;
    const submissions = await getSubmissionsByUserService(userId);

    return res.status(200).json(submissions);
  } catch {
    return res.status(500).json({
      message:
        "Erreur serveur lors de la récupération des submissions utilisateur",
    });
  }
}
