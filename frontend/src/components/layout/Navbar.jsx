import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null); // Naya state user ke liye
  const location = useLocation();

  // Component load hote hi check karein ki koi logged in hai ya nahi
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('hosteljugaad_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch {
      localStorage.removeItem('hosteljugaad_user');
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('hosteljugaad_user');
    setUser(null);
    window.location.href = '/auth'; // Wapas login page par bhej dein
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Academic', path: '/academic' },
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'Lost & Found', path: '/lostfound' },
  ];

  const isActive = (path) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <div className="flex-shrink-0 flex items-center cursor-pointer">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl">🎓</span>
              <span className="font-extrabold text-xl tracking-tight text-blue-600">Hostel<span className="text-gray-800">Jugaad</span></span>
            </Link>
          </div>

          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                  isActive(link.path) ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {/* AGAR USER LOGGED IN HAI */}
            {user ? (
              <div className="flex items-center gap-4">
                <div className="bg-yellow-50 border border-yellow-200 px-3 py-1 rounded-full flex items-center gap-1">
                  <span className="text-sm">⭐</span>
                  <span className="text-sm font-bold text-yellow-700">150</span>
                </div>
                
                <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1.5 rounded-full transition group relative">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden lg:block capitalize">{user.name}</span>
                  
                  {/* Hover karne par Logout button dikhega */}
                  <div className="absolute top-full right-0 mt-2 hidden group-hover:block bg-white border border-gray-100 shadow-lg rounded-xl p-2 w-32">
                    <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition">
                      Log out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* AGAR LOGGED IN NAHI HAI */
              <div className="flex items-center gap-3">
                <Link to="/auth" className="text-gray-600 hover:text-blue-600 font-bold text-sm transition-colors px-2 py-2">
                  Log in
                </Link>
                <Link to="/auth" className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 hover:shadow-md transition-all active:scale-95">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
          {/* ... mobile menu code remains same ... */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;