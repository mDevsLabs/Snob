import { useState, useEffect } from "react";

const MOCK_USERS_KEY = "better_auth_mock_users";
const SESSION_KEY = "better_auth_session";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
}

export interface SessionData {
  session: {
    id: string;
    userId: string;
    expiresAt: string;
  };
  user: SessionUser;
}

export const authClient = {
  signUp: {
    email: async ({ email, password, name }: any) => {
      const users = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || "[]");
      if (users.some((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error("Cet email est déjà utilisé.");
      }
      const newUser = { id: `u-${Date.now()}`, email, password, name };
      users.push(newUser);
      localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));

      const session = { 
        id: `s-${Date.now()}`, 
        userId: newUser.id, 
        expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString() 
      };
      const sessionObj: SessionData = { 
        session, 
        user: { id: newUser.id, email: newUser.email, name: newUser.name } 
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionObj));
      window.dispatchEvent(new Event("better-auth-session-change"));

      return { data: sessionObj };
    }
  },
  signIn: {
    email: async ({ email, password }: any) => {
      const users = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || "[]");
      const user = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      if (!user) {
        throw new Error("Identifiants incorrects.");
      }

      const session = { 
        id: `s-${Date.now()}`, 
        userId: user.id, 
        expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString() 
      };
      const sessionObj: SessionData = { 
        session, 
        user: { id: user.id, email: user.email, name: user.name } 
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionObj));
      window.dispatchEvent(new Event("better-auth-session-change"));

      return { data: sessionObj };
    }
  },
  signOut: async () => {
    localStorage.removeItem(SESSION_KEY);
    window.dispatchEvent(new Event("better-auth-session-change"));
  },
  useSession: () => {
    const [sessionData, setSessionData] = useState<SessionData | null>(null);
    const [isPending, setIsPending] = useState(true);

    const updateSession = () => {
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) {
        setSessionData(JSON.parse(stored));
      } else {
        setSessionData(null);
      }
      setIsPending(false);
    };

    useEffect(() => {
      updateSession();
      window.addEventListener("better-auth-session-change", updateSession);
      return () => {
        window.removeEventListener("better-auth-session-change", updateSession);
      };
    }, []);

    return { data: sessionData, isPending, error: null };
  }
};
