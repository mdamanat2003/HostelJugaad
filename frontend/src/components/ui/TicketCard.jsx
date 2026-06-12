import React from 'react';

const TicketCard = ({ event }) => {
  const isFree = event.price === 0;

  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden shadow-[0_4px_20px_-5px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_-5px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-2 border border-gray-100 flex flex-col h-full">
      
      {/* Decorative Circles to look like a ticket punch */}
      <div className="absolute top-[60%] -left-4 w-8 h-8 bg-gray-50 rounded-full border-r border-gray-100 z-10"></div>
      <div className="absolute top-[60%] -right-4 w-8 h-8 bg-gray-50 rounded-full border-l border-gray-100 z-10"></div>

      {/* Top Half: Image/Banner Area */}
      <div className={`h-48 ${event.theme} flex flex-col justify-between p-5 relative overflow-hidden`}>
        {/* Abstract pattern */}
        <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
        
        <div className="flex justify-between items-start relative z-10">
          <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider border border-white/30">
            {event.category}
          </span>
          <span className="text-4xl drop-shadow-md transform group-hover:scale-110 transition-transform duration-300">{event.icon}</span>
        </div>
        
        <div className="relative z-10 mt-auto">
          <h3 className="text-2xl font-black text-white leading-tight drop-shadow-md line-clamp-2">{event.title}</h3>
        </div>
      </div>

      {/* Dotted separator */}
      <div className="w-full border-t-[3px] border-dashed border-gray-200 mt-[-1.5px] z-20 relative"></div>

      {/* Bottom Half: Details & Action */}
      <div className="p-6 flex flex-col flex-grow bg-white relative z-0">
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Date & Time</p>
            <p className="text-sm font-semibold text-gray-800 leading-tight">{event.date}<br/><span className="text-gray-500">{event.time}</span></p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Venue</p>
            <p className="text-sm font-semibold text-gray-800 leading-tight">{event.location}</p>
          </div>
        </div>
        
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Entry</span>
            <span className={`text-2xl font-black ${isFree ? 'text-emerald-500' : 'text-gray-900'}`}>
              {isFree ? 'FREE' : `₹${event.price}`}
            </span>
          </div>
          <button className={`px-6 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all active:scale-95 flex items-center gap-2 ${
            isFree 
              ? 'bg-gray-900 text-white hover:bg-gray-800' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}>
            🎟️ {isFree ? 'RSVP Now' : 'Buy Pass'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;