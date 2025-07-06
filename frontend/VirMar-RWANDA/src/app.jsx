import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Blog from './pages/Blog.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

function App() {
  return (
    <Router>
      <nav style={styles.nav}>
        <Link to="/blog" style={styles.link}>Blog</Link>
        <Link to="/login" style={styles.link}>Login</Link>
        <Link to="/register" style={styles.link}>Register</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Blog />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

const styles = {
  nav: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    padding: '1rem',
    backgroundColor: '#333',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 'bold',
  }
};

export default App;
