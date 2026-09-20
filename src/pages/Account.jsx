import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Account = () => {
  const { currentUser, login, signup, logout, loginWithGoogle } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLoginMode) {
        await login(email, password);
      } else {
        await signup(email, password, name);
      }
      navigate('/shop');
    } catch (err) {
      setError(err.message);
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
      <div className="container" style={{ padding: '2rem 1rem', maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '1rem' }}>My Account</h1>
        <div style={{ padding: '2rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
          <p><strong>Email:</strong> {currentUser.email}</p>
          <button className="btn btn-primary" onClick={handleLogout} style={{ marginTop: '1rem' }}>
            Log Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '400px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>
        {isLoginMode ? 'Log In' : 'Sign Up'}
      </h1>
      
      {error && <div style={{ color: 'var(--danger-color)', marginBottom: '1rem' }}>{error}</div>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {!isLoginMode && (
          <div>
            <label>Name</label>
            <input 
              type="text" 
              className="input" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required={!isLoginMode} 
            />
          </div>
        )}
        <div>
          <label>Email</label>
          <input 
            type="email" 
            className="input" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Password</label>
          <input 
            type="password" 
            className="input" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {isLoginMode ? 'Log In' : 'Sign Up'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <p>OR</p>
        <button className="btn btn-secondary" onClick={handleGoogleLogin} style={{ width: '100%' }}>
          Continue with Google
        </button>
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <p>
          {isLoginMode ? "Don't have an account? " : "Already have an account? "}
          <button 
            style={{ color: 'blue', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }} 
            onClick={() => setIsLoginMode(!isLoginMode)}
          >
            {isLoginMode ? 'Sign Up' : 'Log In'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Account;
