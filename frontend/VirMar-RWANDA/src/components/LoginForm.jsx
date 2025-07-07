import React, { useState } from 'react';
import axios from 'axios'


function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onLogin) {
      onLogin({ email, password });
    }
    setEmail('');
    setPassword('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)
          
        }
        required
      /><br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      /><br />
      <button type="submit">Login</button>
      {/* form on submit */}
      <button type="button" onClick={() => {
        axios.post('http://localhost:5000/api/seller/register', { email, password })
          .then(response => {
            console.log('Registration successful:', response.data);
            if (onLogin) {
              onLogin(response.data);
            }
          })
          .catch(error => {
            console.error('Login failed:', error);
          });
        // Reset the form fields after login
        setEmail('');
        setPassword('');
      }}>Reset</button>
    </form>
  );
}

export default LoginForm;
