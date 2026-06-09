import { Request, Response } from "express";
import { getMeService, loginService, registerService } from "./auth.service";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";
import { registerSchema, loginSchema } from "./auth.schema";
import { isBlockedEmailDomain } from "../../utils/email.utils";

function setAuthCookie(res: Response, token: string) {
  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export async function registerController(req: Request, res: Response) {
  try {
    const parsedBody = registerSchema.safeParse(req.body);

    if (!parsedBody.success) {
      return res.status(400).json({
        message: parsedBody.error.issues[0].message,
      });
    }

    const { username, email, password } = parsedBody.data;

    if (isBlockedEmailDomain(email)) {
      return res.status(400).json({
        message: "Les adresses email temporaires ne sont pas autorisées.",
      });
    }

    const result = await registerService({
      username,
      email,
      password,
    });

    setAuthCookie(res, result.token);

    return res.status(201).json({
      user: result.user,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({
      message: "Erreur serveur lors de l'inscription",
    });
  }
}

export async function loginController(req: Request, res: Response) {
  try {
    const parsedBody = loginSchema.safeParse(req.body);

    if (!parsedBody.success) {
      return res.status(400).json({
        message: parsedBody.error.issues[0].message,
      });
    }

    const { email, password } = parsedBody.data;

    const result = await loginService({
      email,
      password,
    });

    setAuthCookie(res, result.token);

    return res.status(200).json({
      user: result.user,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({
      message: "Erreur serveur lors de la connexion",
    });
  }
}

export async function logoutController(req: Request, res: Response) {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  });

  return res.status(200).json({
    message: "Déconnexion réussie",
  });
}

export async function meController(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Non authentifié",
      });
    }

    const user = await getMeService(req.user.id);

    return res.status(200).json(user);
  } catch (error) {
    if (error instanceof Error && error.message === "Utilisateur introuvable") {
      return res.status(404).json({ message: error.message });
    }

    return res.status(500).json({
      message: "Erreur serveur lors de la récupération du profil",
    });
  }
}
