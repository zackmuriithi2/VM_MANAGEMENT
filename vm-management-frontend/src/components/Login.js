import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Updated for react-router v6
function Login() {
  // const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const navigate = useNavigate(); // Updated for react-router v6

  const handleSubmit = (e) => {
    e.preventDefault();
    const creds = { username, password };
    
    fetch('https://cautious-engine-4w9vpp9r79vf749x-5000.app.github.dev/login', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(creds),
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to login');
      }
      return response.json();
    })
    .then((data) => {
      let accessToken = data.access_token;
      setSuccessMessage('Successfully logged in! Redirecting to dashbooard...');
      setTimeout(() => {
        localStorage.setItem('accessToken', accessToken);
        navigate('/dashboard');
      }, 3000);
    })
    .catch((err) => {
      setError(err.message || 'Invalid username or password');
    });
  };

  const handleSSOLogin = (provider) => {
    // Mock SSO login flow
    console.log(`Logging in with ${provider} SSO`);
    // Simulate successful SSO login
    localStorage.setItem('userRole', provider); // For demonstration; adapt as needed
    navigate('/dashboard'); // Redirect to the dashboard
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-blue-700">Login</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter your username"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            Login
          </button>
          {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
        </form>

        <div className="mt-4 text-center">
          <span className="text-gray-600">Or login with</span>
        </div>

        {/* SSO Options */}
        <div className="flex justify-around mt-4">
          <button
            onClick={() => handleSSOLogin('Google')}
            className="px-4 py-2 font-bold text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Continue with Google
          </button>
          <button
            onClick={() => handleSSOLogin('GitHub')}
            className="px-4 py-2 font-bold text-white bg-gray-800 rounded-lg hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-800"
          >
            Continue with GitHub
          </button>

        </div>
        <div className="mt-4 text-center">
          <span className="text-gray-600">Already have an account? </span>
          <a href="/signup" className="text-blue-600">Signup</a>
        </div>
      </div>
    </div>
  );
}

export default Login;
