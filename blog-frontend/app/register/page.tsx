'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || 'Registration failed');
        return;
      }

      alert('Account created successfully');
      router.push('/');

    } catch (err) {
      alert(err);
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
          🧾 Create Account
        </h1>

        <input
          type="text"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />

        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        <button onClick={handleRegister} style={buttonStyle}>
          Create Account
        </button>

        <p
          style={{
            marginTop: '1.2rem',
            textAlign: 'center',
            fontSize: '0.9rem',
            color: '#94a3b8',
          }}
        >
          Already have an account?{' '}
          <Link
            href="/"
            style={{
              color: '#3b82f6',
              fontWeight: 600,
            }}
          >
            Login here
          </Link>
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
  background: 'linear-gradient(135deg, #10b981, #059669)',
  color: 'white',
  fontWeight: 600,
  cursor: 'pointer',
  transition: '0.2s',
};