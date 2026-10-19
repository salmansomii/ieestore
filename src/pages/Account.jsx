import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, LogOut } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const Account = () => {
  const { currentUser, login, signup, logout, loginWithGoogle } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLoginMode) {
        await login(email, password);
      } else {
        await signup(email, password, name);
      }
      navigate('/shop');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate('/shop');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      setError(err.message);
    }
  };

  if (currentUser) {
    return (
      <div className="container py-xl" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <Helmet>
          <title>My Account | Taicon Store</title>
        </Helmet>
        <h1 className="text-2xl font-bold mb-md flex items-center gap-xs">
          <User size={24} style={{ color: '#ea580c' }} /> My Account
        </h1>
        <div className="bg-secondary p-lg" style={{ border: '1px solid var(--border-color)', borderRadius: '12px' }}>
          <p className="text-sm mb-xs text-muted">Logged in as:</p>
          <p className="font-bold text-base mb-md">{currentUser.email}</p>
          <button className="btn btn-outline text-xs flex items-center gap-xs" onClick={handleLogout} style={{ color: '#ef4444', borderColor: '#ef4444' }}>
            <LogOut size={16} /> Log Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-xl" style={{ maxWidth: '420px', margin: '0 auto' }}>
      <Helmet>
        <title>{isLoginMode ? 'Log In' : 'Sign Up'} | Taicon Store</title>
      </Helmet>
      
      <div className="text-center mb-lg">
        <h1 className="text-2xl font-bold mb-xs">
          {isLoginMode ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p className="text-muted text-xs">
          {isLoginMode ? 'Sign in to view orders and manage your account' : 'Register to track orders and save details'}
        </p>
      </div>
      
      {error && (
        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#dc2626', padding: '0.65rem 0.85rem', borderRadius: '8px', fontSize: '0.8rem', marginBottom: '1rem' }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {!isLoginMode && (
          <div>
            <label className="text-xs font-semibold block mb-xs">Full Name</label>
            <input 
              type="text" 
              className="input" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required={!isLoginMode} 
              placeholder="Your name"
            />
          </div>
        )}
        <div>
          <label className="text-xs font-semibold block mb-xs">Email Address</label>
          <input 
            type="email" 
            className="input" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            placeholder="name@example.com"
          />
        </div>
        <div>
          <label className="text-xs font-semibold block mb-xs">Password</label>
          <input 
            type="password" 
            className="input" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            placeholder="••••••••"
          />
        </div>
        <button type="submit" className="btn btn-primary btn-full font-bold text-sm mt-xs" disabled={loading} style={{ backgroundColor: '#ea580c', borderColor: '#ea580c' }}>
          {loading ? 'Please wait...' : (isLoginMode ? 'Sign In' : 'Sign Up')}
        </button>
      </form>

      <div style={{ textAlign: 'center', margin: '1.25rem 0 1rem' }}>
        <p className="text-xs text-muted mb-sm">OR</p>
        <button className="btn btn-secondary btn-full text-xs" onClick={handleGoogleLogin}>
          Continue with Google
        </button>
      </div>

      <div style={{ textAlign: 'center' }}>
        <p className="text-xs text-muted">
          {isLoginMode ? "Don't have an account? " : "Already have an account? "}
          <button 
            style={{ color: '#ea580c', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} 
            onClick={() => setIsLoginMode(!isLoginMode)}
          >
            {isLoginMode ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Account;
