import React, { useState, useEffect } from 'react';
import { loginAdmin } from '../api/service';
import toast from 'react-hot-toast';
import './AdminLogin.css';

export default function AdminLogin({ onLogin }: { onLogin: (token: string) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) { toast.error('Please fill all fields'); return; }
    setLoading(true);
    try {
      const res = await loginAdmin(username, password);
      if (res.success) {
        localStorage.setItem('qasak_admin_token', res.token);
        toast.success('Login successful!');
        onLogin(res.token);
      }
    } catch {
      toast.error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="login-bg">
        <div className="login-glow g1"></div>
        <div className="login-glow g2"></div>
      </div>
      <form className="login-card glass-card" onSubmit={handleSubmit}>
        <div className="login-header">
          <h1 className="login-logo">QASAK</h1>
          <p className="login-sub">Admin Panel</p>
        </div>
        <div className="form-group">
          <label>Username</label>
          <input type="text" className="input-field" value={username} onChange={e => setUsername(e.target.value)} placeholder="Admin username" />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" className="input-field" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
        </div>
        <button type="submit" className="btn-neon login-btn" disabled={loading}>
          {loading ? 'Authenticating...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
