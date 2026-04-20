import { Request, Response } from "express";
import {
  createTestCaseService,
  deleteTestCaseService,
  getAllTestCasesService,
  getTestCaseByIdService,
  getTestCasesByChallengeService,
  updateTestCaseService,
} from "./testCases.service";
import { ApiError } from "../../utils/ApiError";
import { CreateTestCaseBody, UpdateTestCaseBody } from "../types/testCases";

type IdParams = {
  id: string;
};

type ChallengeParams = {
  challengeId: string;
};

export async function createTestCaseController(
  req: Request<Record<string, string>, unknown, CreateTestCaseBody>,
  res: Response,
) {
  try {
    const {
      challengeId,
      input,
      expectedOutput: rawExpectedOutput,
      expected,
      explanation,
      isHidden,
      orderIndex,
    } = req.body;

    const expectedOutput = rawExpectedOutput ?? expected;

    if (!challengeId || input === undefined || expectedOutput === undefined) {
      return res.status(400).json({
        message: "challengeId, input et expectedOutput sont requis",
      });
    }

    const testCase = await createTestCaseService({
      challengeId,
      input,
      expectedOutput,
      explanation,
      isHidden,
      orderIndex,
    });

    return res.status(201).json(testCase);
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }

    return res.status(500).json({
      message: "Erreur serveur lors de la création du test case",
    });
  }
}

export async function getAllTestCasesController(req: Request, res: Response) {
  try {
    const testCases = await getAllTestCasesService();
    return res.status(200).json(testCases);
  } catch {
    return res.status(500).json({
      message: "Erreur serveur lors de la récupération des test cases",
    });
  }
}

export async function getTestCaseByIdController(
  req: Request<IdParams>,
  res: Response,
) {
  try {
    const { id } = req.params;

    const testCase = await getTestCaseByIdService(id);

    return res.status(200).json(testCase);
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    return res.status(500).json({
      message: "Erreur serveur lors de la récupération du test case",
    });
  }
}

export async function getTestCasesByChallengeController(
  req: Request<ChallengeParams>,
  res: Response,
) {
  try {
    const { challengeId } = req.params;

    const testCases = await getTestCasesByChallengeService(challengeId);

    return res.status(200).json(testCases);
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    return res.status(500).json({
      message:
        "Erreur serveur lors de la récupération des test cases du challenge",
    });
  }
}

export async function updateTestCaseController(
  req: Request<IdParams, unknown, UpdateTestCaseBody>,
  res: Response,
) {
  try {
    const { id } = req.params;
    const {
      input,
      expectedOutput: rawExpectedOutput,
      expected,
      explanation,
      isHidden,
      orderIndex,
    } = req.body;

    const expectedOutput = rawExpectedOutput ?? expected;

    if (
      input === undefined &&
      expectedOutput === undefined &&
      explanation === undefined &&
      isHidden === undefined &&
      orderIndex === undefined
    ) {
      throw new ApiError(400, "Aucune donnée fournie pour la mise à jour");
    }

    const updatedTestCase = await updateTestCaseService(id, {
      input,
      expectedOutput,
      explanation,
      isHidden,
      orderIndex,
    });

    return res.status(200).json(updatedTestCase);
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    return res.status(500).json({
      message: "Erreur serveur lors de la mise à jour du test case",
    });
  }
}

export async function deleteTestCaseController(
  req: Request<IdParams>,
  res: Response,
) {
  try {
    const { id } = req.params;

    const result = await deleteTestCaseService(id);

    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    return res.status(500).json({
      message: "Erreur serveur lors de la suppression du test case",
    });
  }
}
