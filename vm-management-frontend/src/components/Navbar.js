import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">
          VM Management
        </h1>
        <div className="flex space-x-4">
          <Link to="/dashboard" className="text-white hover:bg-gray-700 px-3 py-2 rounded">
            Dashboard
          </Link>
          <Link to="/billing" className="text-white hover:bg-gray-700 px-3 py-2 rounded">
            Billing
          </Link>
          <Link to="/login" className="text-white hover:bg-gray-700 px-3 py-2 rounded">
            Logout
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
