import React, { useState } from 'react';
import { useHSAuth } from './useHSAuth';

export function LoginModal({ onSuccess }) {
  const { login, license, loading, error } = useHSAuth();
  const [tab, setTab] = useState('license'); // 'license' or 'credentials'
  const [key, setKey] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    let res;
    if (tab === 'license') {
      res = await license(key);
    } else {
      res = await login(username, password);
    }
    if (res.success && onSuccess) {
      onSuccess(res.info);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 24, background: '#0f172a', borderRadius: 12, color: '#fff', border: '1px solid #1e293b' }}>
      <h2 style={{ margin: '0 0 16px', color: '#6366f1', textAlign: 'center' }}>HS DEVS AUTH</h2>
      
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button
          type="button"
          onClick={() => setTab('license')}
          style={{ flex: 1, padding: '8px 12px', background: tab === 'license' ? '#6366f1' : '#1e293b', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}
        >
          License Key
        </button>
        <button
          type="button"
          onClick={() => setTab('credentials')}
          style={{ flex: 1, padding: '8px 12px', background: tab === 'credentials' ? '#6366f1' : '#1e293b', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}
        >
          Username / Pass
        </button>
      </div>

      {error && <div style={{ color: '#ef4444', marginBottom: 12, fontSize: 14 }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {tab === 'license' ? (
          <div>
            <label style={{ fontSize: 13, color: '#94a3b8' }}>License Key</label>
            <input
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="HSAUTH-XXXX-XXXX-XXXX-XXXX"
              required
              style={{ width: '100%', padding: '10px', marginTop: 4, background: '#1e293b', border: '1px solid #334155', borderRadius: 6, color: '#fff' }}
            />
          </div>
        ) : (
          <>
            <div>
              <label style={{ fontSize: 13, color: '#94a3b8' }}>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{ width: '100%', padding: '10px', marginTop: 4, background: '#1e293b', border: '1px solid #334155', borderRadius: 6, color: '#fff' }}
              />
            </div>
            <div>
              <label style={{ fontSize: 13, color: '#94a3b8' }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '10px', marginTop: 4, background: '#1e293b', border: '1px solid #334155', borderRadius: 6, color: '#fff' }}
              />
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{ marginTop: 8, padding: '12px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 'bold', cursor: 'pointer' }}
        >
          {loading ? 'Authenticating...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
