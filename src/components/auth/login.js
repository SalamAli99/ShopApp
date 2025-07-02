import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const login = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    setMessage(''); // Clear any previous message

    try {
      const res = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token); // Save the token in localStorage
        navigate('/products'); // Redirect to products page
        setMessage('Login successful!'); // Success message
      } else {
        setMessage(data.message || 'Login failed'); // Error message
      }
    } catch (error) {
      console.error(error);
      setMessage('Server error, please try again later');
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div>
      <button type='button' onClick={()=>{
        navigate('/products');
      }}> Products List</button>
      <button type='button' onClick={()=>{
        navigate('/signup');
      }}><span>do not have account ?! </span>Register</button>
      <h2>Login</h2>
      <form onSubmit={login}>
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={user.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={user.password}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>

      {/* Display message */}
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;
