import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { TOKEN_KEY } from '../api/axios';
import { loginRequest, getMe } from '../api/endpoints';

// NOTE: For portfolio simplicity the JWT lives in localStorage.
// In production, an httpOnly cookie is the more secure choice (immune to XSS token theft).
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, if we have a token, try to restore the session.
  useEffect(() => {
    let active = true;
    const restore = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const me = await getMe();
        if (active) setUser(me);
      } catch {
        localStorage.removeItem(TOKEN_KEY);
      } finally {
        if (active) setLoading(false);
      }
    };
    restore();
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (credentials) => {
    const { token, user: loggedIn } = await loginRequest(credentials);
    localStorage.setItem(TOKEN_KEY, token);
    setUser(loggedIn);
    return loggedIn;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, isAuthenticated: Boolean(user), login, logout }),
    [user, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
