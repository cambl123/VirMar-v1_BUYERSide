import React from 'react';
import LoginForm from '../components/LoginForm';

function Login() {
  const handleLogin = (data) => {
    console.log('Login data:', data);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Login to VirMar</h2>
      <LoginForm onLogin={handleLogin} />
    </div>
  );
}

export default Login;
// This is the login page for the VirMar project, allowing users to log in with their credentials.