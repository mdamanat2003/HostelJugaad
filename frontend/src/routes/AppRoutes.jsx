import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// Components & Pages Import
import Navbar from '../components/layout/Navbar';
import Dashboard from '../pages/Dashboard';
import Marketplace from '../pages/Marketplace';
import Academic from '../pages/Academic';
import Auth from '../pages/Auth'; 
import LostFound from '../pages/LostFound';
import Events from '../pages/Events';


const AppRoutes = () => {
  const location = useLocation();
  // Agar URL /auth hai, toh Navbar hide kar do
  const hideNavbar = location.pathname === '/auth';

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {!hideNavbar && <Navbar />}
      
      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/academic" element={<Academic />} />
          <Route path="/lostfound" element={<LostFound />} />
          <Route path="/events" element={<Events />} />
        </Routes>
      </main>
    </div>
  );
};

export default AppRoutes;