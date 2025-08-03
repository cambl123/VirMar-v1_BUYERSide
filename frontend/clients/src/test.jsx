import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../configs/api.config'; // Correct path to your config file

function LoginForm({ onLoginSuccess }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Use the dynamic API_BASE_URL for the login request
      const response = await axios.post(
        `${API_BASE_URL}/api/buyer/login`,
        formData,
        { withCredentials: true }
      );

      setLoading(false);
      // The backend should return a token and user object on successful login,
      // not a `success` boolean. Let's adjust the success check.
      if (response.data.token) {
        onLoginSuccess(response.data);
        navigate('/profile');
      } else {
        // This handles cases where the backend responds without a token
        setError(response.data.message || 'Login failed.');
      }
    } catch (err) {
      setLoading(false);
      // The error handling is solid, no changes needed here.
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="login-container" style={{ maxWidth: 400, margin: 'auto', padding: '2rem' }}>
      <h2 className="text-2xl font-bold mb-4 text-center">Sign in to VirMar</h2>

      <form onSubmit={handleSubmit}>
        <label className="block mb-2">Email</label>
        <div className="form-control" style={{ marginBottom: '1.5rem' }}>
          <input
            className="input input-alt"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <span className="input-border input-border-alt"></span>
        </div>

        <label className="block mb-2">Password</label>
        <div className="form-control" style={{ marginBottom: '1.5rem' }}>
          <input
            className="input input-alt"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <span className="input-border input-border-alt"></span>
        </div>

        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
          <label>
            <input
              type="checkbox"
              onChange={() => setShowPassword(!showPassword)}
            /> Show password
          </label>
          <label>
            <input type="checkbox" /> Remember me
          </label>
        </div>

        {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '1em',
            fontSize: '1.1rem',
            backgroundColor: '#47C9FF',
            color: 'white',
            border: 'none',
            borderRadius: 5,
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        <p>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#FF6464' }}>
            Register
          </Link>
        </p>
        <p>
          <Link to="/" style={{ color: '#888' }}>
            ← Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;