import React, { useState } from 'react';
import TicketCard from '../../components/ui/TicketCard';
import PageLayout from '../../components/ui/PageLayout';
import FilterTabs from '../../components/ui/FilterTabs';
import EmptyState from '../../components/ui/EmptyState';

const Events = () => {
  // --- LOGIC PART ---
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', 'Cultural Fest', 'Tech Hackathon', 'Sports', 'Workshops'];

  // Dummy Data
  const eventsList = [
    { 
      id: 1, title: 'Zephyr 2026: Annual Cultural Fest', category: 'Cultural Fest', 
      date: 'Nov 15 - Nov 17', time: '5:00 PM Onwards', location: 'Main University Ground', 
      price: 499, icon: '\uD83C\uDFB8', theme: 'bg-gradient-to-br from-violet-600 to-fuchsia-600'
    },
    { 
      id: 2, title: 'CodeRed: 24Hr National Hackathon', category: 'Tech Hackathon', 
      date: 'Dec 02', time: '10:00 AM Starts', location: 'CSE Block, Labs 1-4', 
      price: 0, icon: '\uD83D\uDCBB', theme: 'bg-gradient-to-br from-cyan-600 to-blue-700'
    },
    { 
      id: 3, title: 'Inter-Hostel Football Championship', category: 'Sports', 
      date: 'This Weekend', time: '4:00 PM', location: 'Sports Complex', 
      price: 50, icon: '\u26BD', theme: 'bg-gradient-to-br from-emerald-500 to-teal-700'
    },
    { 
      id: 4, title: 'AI & Robotics Workshop by Alumni', category: 'Workshops', 
      date: 'Next Tuesday', time: '2:00 PM - 5:00 PM', location: 'Main Auditorium', 
      price: 0, icon: '\uD83E\uDD16', theme: 'bg-gradient-to-br from-orange-500 to-red-600'
    },
  ];

  const filteredEvents = activeCategory === 'All' 
    ? eventsList 
    : eventsList.filter(e => e.category === activeCategory);

  // --- DESIGN (UI) PART ---
  return (
    <PageLayout>
      {/* Premium Dark Banner (Festival Vibe) */}
      <div className="relative overflow-hidden bg-gray-900 rounded-[2rem] p-8 md:p-12 text-white shadow-2xl flex flex-col md:flex-row justify-between items-center group">
        {/* Neon Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-fuchsia-600 opacity-20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 group-hover:opacity-30 transition-opacity duration-700"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500 opacity-20 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 group-hover:opacity-30 transition-opacity duration-700"></div>

        {/* Grid Pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

        <div className="relative z-10 w-full md:w-2/3">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-6">
            <span className="text-sm font-bold tracking-widest uppercase text-fuchsia-300">Live Campus Events</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 leading-[1.1]">
            Never miss out on the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400">Campus Hype.</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl font-medium max-w-lg">
            Book tickets for upcoming fests, register for hackathons, and secure your spot in workshops before they sell out.
          </p>
        </div>
        
        <div className="relative z-10 mt-8 md:mt-0 w-full md:w-auto">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl flex flex-col items-center shadow-2xl">
            <span className="text-5xl mb-2">&#x1F3AB;</span>
            <p className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-1">Your Active Passes</p>
            <span className="text-3xl font-black text-white">0</span>
            <button className="mt-4 w-full bg-white text-gray-900 px-6 py-2 rounded-xl text-sm font-bold hover:bg-gray-100 transition-colors">
              View My Tickets
            </button>
          </div>
        </div>
      </div>

      {/* Filter Categories */}
      <FilterTabs
        tabs={categories}
        activeTab={activeCategory}
        onTabChange={setActiveCategory}
        variant="pill"
      />

      {/* Tickets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-2">
        {filteredEvents.length > 0 ? (
          filteredEvents.map(event => (
            <TicketCard key={event.id} event={event} />
          ))
        ) : (
          <EmptyState
            icon="&#x1F4ED;"
            title="No events scheduled"
            message="There are currently no upcoming events in this category. Check back later!"
          />
        )}
      </div>
    </PageLayout>
  );
};

export default Events;
