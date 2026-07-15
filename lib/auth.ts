import { betterAuth } from "better-auth";

export const auth = betterAuth({
  // Base URL de l'application (utilisé pour les cookies et redirections)
  baseURL: process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || "http://localhost:3000",

  // Secret pour signer les sessions
  secret: process.env.BETTER_AUTH_SECRET || (() => { throw new Error("BETTER_AUTH_SECRET environment variable is not set") })(),

  // Email & Password activé
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    autoSignIn: true, // Se connecte automatiquement après inscription
  },

  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 jours
    updateAge: 60 * 60 * 24,     // Refresh tous les jours
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes de cache côté client
    },
  },

  // Stockage en base de données
  // Note: better-auth utilise une base SQLite locale par défaut pour le développement.
  // En production, configurez un vrai adaptateur (Prisma, Drizzle, etc.)
  // Pour ce projet, on utilise le stockage en cookie + state local (via auth-client)
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
