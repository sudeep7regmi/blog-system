'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please fill all fields');
      return;
    }

    try {
      const res = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          email: email.trim(),
          password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || 'Login failed');
        return;
      }

      router.push('/dashboard');

    } catch (err) {
      console.log(err);
      alert('Server error');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#0f172a',
        color: '#e2e8f0',
      }}
    >
      <div
        className="card"
        style={{
          width: '380px',
          background: '#1e293b',
          padding: '2rem',
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
          border: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <h1 style={{ marginBottom: '1.5rem', fontSize: '1.8rem' }}>
          🔐 Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        <button onClick={handleLogin} style={buttonStyle}>
          Login
        </button>

        <p
          style={{
            marginTop: '1.2rem',
            textAlign: 'center',
            fontSize: '0.9rem',
            color: '#94a3b8',
          }}
        >
          New user?{' '}
          <span
            onClick={() => router.push('/register')}
            style={{
              color: '#3b82f6',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '12px',
  marginBottom: '12px',
  borderRadius: '10px',
  border: '1px solid #334155',
  background: '#0f172a',
  color: '#e2e8f0',
  outline: 'none',
};

const buttonStyle = {
  width: '100%',
  padding: '12px',
  borderRadius: '10px',
  border: 'none',
  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
  color: 'white',
  fontWeight: 600,
  cursor: 'pointer',
  transition: '0.2s',
};