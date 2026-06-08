import rateLimit from "express-rate-limit";

export const submissionRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 10,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    message: "Trop de soumissions. Réessaie dans quelques instants.",
  },
});
