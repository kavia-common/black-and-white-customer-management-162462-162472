import React from 'react';
import { apiLogin, apiLogout, apiHealth } from '../api';

const AuthContext = React.createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = React.useState(() => {
    try {
      const raw = localStorage.getItem('auth_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = React.useState(false);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    // Optionally ping health to assert backend is reachable.
    let mounted = true;
    (async () => {
      try {
        await apiHealth();
      } catch {
        // ignore health errors in UI init
      } finally {
        if (mounted) setReady(true);
      }
    })();
    return () => { mounted = false; };
  }, []);

  React.useEffect(() => {
    try {
      if (user) localStorage.setItem('auth_user', JSON.stringify(user));
      else localStorage.removeItem('auth_user');
    } catch {
      // ignore
    }
  }, [user]);

  // PUBLIC_INTERFACE
  const login = async (username, password) => {
    /** Login and set user in state. */
    setLoading(true);
    try {
      const data = await apiLogin(username, password);
      // Backend returns basic user info; if not, synthesize minimal object
      const u = data && typeof data === 'object' ? data : { username };
      setUser(u);
      return u;
    } finally {
      setLoading(false);
    }
  };

  // PUBLIC_INTERFACE
  const logout = async () => {
    /** Logout and clear user state. */
    setLoading(true);
    try {
      await apiLogout();
    } catch {
      // ignore errors
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, ready }}>
      {children}
    </AuthContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useAuthProvider({ children }) {
  /** Helper to wrap subtree with AuthProvider. */
  return <AuthProvider>{children}</AuthProvider>;
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Access auth context values. */
  const ctx = React.useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within <AuthProvider>');
  }
  return ctx;
}

export default AuthProvider;
