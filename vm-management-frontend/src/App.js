import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';           // Updated path
import Dashboard from './components/Dashboard';   // Updated path
import Billing from './components/Billing';       // Updated path
import Navbar from './components/Navbar';         // Updated path

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/billing" element={<Billing />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
