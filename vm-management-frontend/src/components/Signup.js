// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom'; // Updated for react-router v6

// function Signup() {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate(); // Updated for react-router v6

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // Basic validation
//     if (password !== confirmPassword) {
//       setError('Passwords do not match');
//       return;
//     }

//     // Mock user registration process (replace with actual API call)
//     const newUser = { username, password, role: 'user' }; // Default role
//     console.log("newUser",newUser)
//     fetch('http://localhost:8000/users', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(newUser),
//     })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error('Failed to register');
//         }
//         return response.json();
//       })
//       .then(() => {
//         navigate('/login'); // Redirect to login page after successful signup
//       })
//       .catch((err) => {
//         setError(err.message);
//       });
//   };

//   const handleSSOSignup = (provider) => {
//     // Mock SSO signup flow
//     console.log(`Signing up with ${provider} SSO`);
//     // Simulate successful SSO signup
//     localStorage.setItem('userRole', provider); // For demonstration; adapt as needed
//     navigate('/dashboard'); // Redirect to the dashboard
//   };

//   return (
//     <div className="flex justify-center items-center h-screen bg-gray-100">
//       <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
//         <h2 className="text-3xl font-bold text-center text-blue-700">Sign Up</h2>
//         <form className="space-y-4" onSubmit={handleSubmit}>
//           <div>
//             <label className="block text-gray-700">Username</label>
//             <input
//               type="text"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
//               placeholder="Choose a username"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-gray-700">Password</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
//               placeholder="Enter your password"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-gray-700">Confirm Password</label>
//             <input
//               type="password"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
//               placeholder="Confirm your password"
//               required
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
//           >
//             Sign Up
//           </button>
//           {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
//         </form>
        
//         <div className="mt-4 text-center">
//           <span className="text-gray-600">Or sign up with</span>
//         </div>

//         {/* SSO Options */}
//         <div className="flex justify-around mt-4">
//           <button
//             onClick={() => handleSSOSignup('Google')}
//             className="px-4 py-2 font-bold text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
//           >
//             Continue with Google
//           </button>
//           <button
//             onClick={() => handleSSOSignup('GitHub')}
//             className="px-4 py-2 font-bold text-white bg-gray-800 rounded-lg hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-800"
//           >
//             Continue with GitHub
//           </button>
//         </div>

//         <div className="mt-4 text-center">
//           <span className="text-gray-600">Already have an account? </span>
//           <a href="/login" className="text-blue-600">Login</a>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Signup;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Updated for react-router v6

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const navigate = useNavigate(); // Updated for react-router v6

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const newUser = { username, password, role: 'user' }; // Default role
    console.log("newUser", newUser);

    fetch('http://localhost:8000/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to register');
        }
        return response.json();
      })
      .then(() => {
        setSuccessMessage('Successfully registered! Redirecting to login...');
        setTimeout(() => {
          navigate('/login'); // Redirect to login page after successful signup
        }, 3000);
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  const handleSSOSignup = (provider) => {
    // Mock SSO signup flow
    console.log(`Signing up with ${provider} SSO`);
    // Simulate successful SSO signup
    localStorage.setItem('userRole', provider); // For demonstration; adapt as needed
    navigate('/dashboard'); // Redirect to the dashboard
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-blue-700">Sign Up</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Choose a username"
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
          <div>
            <label className="block text-gray-700">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Confirm your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            Sign Up
          </button>
          {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
          {successMessage && <p className="text-green-500 mt-2 text-center">{successMessage}</p>}
        </form>
        
        <div className="mt-4 text-center">
          <span className="text-gray-600">Or sign up with</span>
        </div>

        {/* SSO Options */}
        <div className="flex justify-around mt-4">
          <button
            onClick={() => handleSSOSignup('Google')}
            className="px-4 py-2 font-bold text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Continue with Google
          </button>
          <button
            onClick={() => handleSSOSignup('GitHub')}
            className="px-4 py-2 font-bold text-white bg-gray-800 rounded-lg hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-800"
          >
            Continue with GitHub
          </button>
        </div>

        <div className="mt-4 text-center">
          <span className="text-gray-600">Already have an account? </span>
          <a href="/login" className="text-blue-600">Login</a>
        </div>
      </div>
    </div>
  );
}

export default Signup;
