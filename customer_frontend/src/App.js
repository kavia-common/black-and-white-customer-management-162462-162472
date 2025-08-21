import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import CustomerListPage from './pages/CustomerListPage';
import CustomerFormPage from './pages/CustomerFormPage';
import { useAuth } from './hooks/useAuth';

// PUBLIC_INTERFACE
function App() {
  /** Root app that sets up routes and basic layout (navbar). */

  const { user, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="app">
        <nav className="navbar">
          <div className="brand">
            <Link to="/">Customer Manager</Link>
          </div>
          <div className="nav-actions">
            {user ? (
              <>
                <span style={{ fontSize: 13, color: '#555' }}>
                  Signed in as <strong>{user?.username || 'user'}</strong>
                </span>
                <button className="btn ghost" onClick={logout}>Logout</button>
              </>
            ) : (
              <Link className="btn ghost" to="/login">Login</Link>
            )}
          </div>
        </nav>

        <main className="container">
          <Routes>
            <Route path="/" element={<RequireAuth><CustomerListPage /></RequireAuth>} />
            <Route path="/customers/new" element={<RequireAuth><CustomerFormPage /></RequireAuth>} />
            <Route path="/customers/:id" element={<RequireAuth><CustomerFormPage /></RequireAuth>} />
            <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

// PUBLIC_INTERFACE
function RequireAuth({ children }) {
  /** Gate routes: If not logged-in redirect to /login. */
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default App;
