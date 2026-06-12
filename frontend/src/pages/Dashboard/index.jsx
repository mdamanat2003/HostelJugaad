import React, { useState, useEffect } from 'react';
import QuickActionCard from '../../components/ui/QuickActionCard';
import PageLayout from '../../components/ui/PageLayout';

const Dashboard = () => {
  const [userStats, setUserStats] = useState({
    jugaadPoints: 0,
  });

  const quickLinks = [
    { title: "Academic Hub", desc: "Access PYQs, Notes & Study Material", icon: "\uD83D\uDCDA", link: "/academic" },
    { title: "Marketplace", desc: "Buy & Sell college essentials", icon: "\uD83D\uDED2", link: "/marketplace", badge: "Hot" },
    { title: "Lost & Found", desc: "Report or find missing items", icon: "\uD83D\uDD0D", link: "/lostfound" },
    { title: "Campus Events", desc: "Book fest tickets and passes", icon: "\uD83C\uDF9F\uFE0F", link: "/events" },
  ];

  useEffect(() => {
    setUserStats({
      jugaadPoints: 150,
    });
  }, []);

  return (
    <PageLayout className="space-y-10">
      {/* Modern Gradient Banner (StudentSenior Inspired) */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-3xl p-8 md:p-10 text-white shadow-xl shadow-blue-900/20 flex flex-col md:flex-row justify-between items-start md:items-center">
        
        {/* Abstract circles for design */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">Welcome back, Student! &#x1F44B;</h1>
          <p className="text-blue-100 text-lg max-w-lg">Ready to ace your semester with HostelJugaad? Explore resources, buy/sell, and stay connected.</p>
        </div>
        
        <div className="relative z-10 mt-6 md:mt-0">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-4 rounded-2xl flex flex-col items-center shadow-inner hover:bg-white/20 transition-all cursor-pointer">
            <p className="text-sm uppercase tracking-widest font-semibold text-blue-100 mb-1">Jugaad Points</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl">&#x2B50;</span>
              <span className="text-3xl font-black text-yellow-400">{userStats.jugaadPoints}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Hub Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Quick Access Hub</h2>
          <span className="text-sm font-medium text-blue-600 cursor-pointer hover:underline">View All &#x2192;</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickLinks.map((link, index) => (
            <QuickActionCard 
              key={index}
              title={link.title}
              description={link.desc}
              icon={link.icon}
              linkTo={link.link}
              badgeText={link.badge}
            />
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
