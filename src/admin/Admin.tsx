import React, { useState } from 'react';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem('qasak_admin_token'));

  if (!token) {
    return <AdminLogin onLogin={(t) => setToken(t)} />;
  }

  return <AdminDashboard onLogout={() => setToken(null)} />;
}
