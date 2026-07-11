// Better Auth client configuration
// Compatible avec better-auth v1.x
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // URL de base de l'application pour les requêtes API
  baseURL:
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

// Re-exporter les hooks et méthodes pratiques
export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient;

// Types utiles
export type SessionUser = {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type SessionData = {
  user: SessionUser;
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
    token: string;
  };
};
