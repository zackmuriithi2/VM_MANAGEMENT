import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Billing from './components/Billing';
import Login from './components/Login';
import Signup  from './components/Signup';
import Navbar from './components/Navbar';
// import { createClient } from '@supabase/supabase-js'
// import { Auth } from '@supabase/auth-ui-react'
// import { ThemeSupa } from '@supabase/auth-ui-shared'


function App() {

  return (
    <Router>
      <Main />
    </Router>
  );
}

function Main() {
  const role = localStorage.getItem("userRole");
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if the role is not present
    if (!role && location.pathname !== '/signup') {
      navigate("/login");
    }
  }, [role, navigate]);

  return (
    <>
      {role && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={role ? <Dashboard /> : <Login />} />
        <Route path="/billing" element={role ? <Billing /> : <Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup/>}/>

      </Routes>
    </>
  );
}

export default App;
