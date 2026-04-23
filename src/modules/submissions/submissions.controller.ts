import { Response } from "express";
import {
  createSubmissionService,
  getSubmissionByIdService,
  getSubmissionsByChallengeService,
  getSubmissionsByUserService,
} from "./submissions.service";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";

export async function createSubmissionController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Non authentifié",
      });
    }

    const { challengeId, sourceCode, language } = req.body;

    if (!challengeId || !sourceCode) {
      return res.status(400).json({
        message: "challengeId et sourceCode sont requis",
      });
    }

    const result = await createSubmissionService({
      userId: req.user.id,
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
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const { id } = req.params;
    const submissionId = Array.isArray(id) ? id[0] : id;
    const submission = await getSubmissionByIdService(submissionId);

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
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const { challengeId } = req.params;
    const challengeIdParam = Array.isArray(challengeId)
      ? challengeId[0]
      : challengeId;
    const submissions =
      await getSubmissionsByChallengeService(challengeIdParam);

    return res.status(200).json(submissions);
  } catch {
    return res.status(500).json({
      message:
        "Erreur serveur lors de la récupération des submissions du challenge",
    });
  }
}

export async function getSubmissionsByUserController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const { userId } = req.params;
    const userIdParam = Array.isArray(userId) ? userId[0] : userId;
    const submissions = await getSubmissionsByUserService(userIdParam);

    return res.status(200).json(submissions);
  } catch {
    return res.status(500).json({
      message:
        "Erreur serveur lors de la récupération des submissions utilisateur",
    });
  }
}
