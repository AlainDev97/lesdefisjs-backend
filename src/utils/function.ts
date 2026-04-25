// Fonction utilitaire pour filtrer les résultats d'une soumission en fonction du rôle de l'utilisateur
export function filterSubmissionResultsForUser(
  submission: any,
  currentUser: { id: string; role: string },
) {
  const isAdmin = currentUser.role === "ADMIN";

  if (isAdmin) return submission;

  return {
    ...submission,
    results: submission.results
      .filter((r: any) => !r.testCase.isHidden)
      .map((r: any) => ({
        ...r,
        expectedOutput: undefined, // Ne pas révéler l'output attendu pour les utilisateurs non-admins
        testCase: {
          ...r.testCase,
          expectedOutput: undefined,
        },
      })),
  };
}
