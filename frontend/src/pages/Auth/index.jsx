import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';

const Auth = () => {
  // --- LOGIC PART ---
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    collegeName: '',
    studentType: 'Hosteler',
    rollNumber: '',
    hostelBlock: '',
    roomNumber: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      console.log("Logging in...");
      // Mock Login: User ka data localStorage mein save kar rahe hain
      const userData = { 
        name: formData.email.split('@')[0], // Email ka pehla hissa naam ki tarah le rahe hain
        role: formData.studentType 
      };
      localStorage.setItem('hosteljugaad_user', JSON.stringify(userData));
      
      // Home page par redirect karein (reload ke sath taaki Navbar update ho jaye)
      window.location.href = '/'; 
    } else {
      console.log("Registering...");
      alert("Registration Successful! Please log in.");
      // Registration successful hone ke baad form ko Login par switch kar dein
      setIsLogin(true);
    }
  };

  // --- DESIGN (UI) PART ---
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-8 font-sans">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
        
        {/* Left Side - Branding & Info */}
        <div className="md:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-700 to-violet-800 p-10 text-white flex flex-col justify-between relative overflow-hidden hidden md:flex">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 opacity-20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-12">
              <span className="text-4xl bg-white rounded-xl p-2 shadow-lg">🎓</span>
              <span className="font-black text-2xl tracking-tight">Hostel<span className="text-blue-200">Jugaad</span></span>
            </div>
            <h1 className="text-4xl font-extrabold mb-4 leading-tight">Your Campus<br/>Companion</h1>
            <p className="text-blue-100 text-lg max-w-md">
              Buy & sell old items, access PYQs, report lost items, and stay updated with campus fests all in one place.
            </p>
          </div>

          <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl">
            <p className="text-sm font-medium text-blue-100 italic">"Making campus life easier, smarter, and well-managed."</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center bg-white relative max-h-[90vh] overflow-y-auto hide-scrollbar">
          <div className="max-w-md w-full mx-auto">
            
            {/* Mobile Branding */}
            <div className="md:hidden flex items-center gap-2 mb-8 justify-center">
              <span className="text-3xl">🎓</span>
              <span className="font-black text-2xl text-blue-700">Hostel<span className="text-gray-900">Jugaad</span></span>
            </div>

            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
              {isLogin ? 'Welcome Back!' : 'Join HostelJugaad'}
            </h2>
            <p className="text-gray-500 mb-6 font-medium">
              {isLogin ? 'Enter your student credentials to log in.' : 'Create your account to start exploring the campus ecosystem.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Registration Specific Fields */}
              {!isLogin && (
                <>
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-gray-700">Full Name</label>
                    <input 
                      type="text" 
                      name="name"
                      placeholder="e.g. Md Amanat Ullah" 
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-gray-800"
                      required={!isLogin}
                    />
                  </div>

                  {/* Naya: College Name */}
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-gray-700">College Name</label>
                    <input 
                      type="text" 
                      name="collegeName"
                      placeholder="e.g. Integral University" 
                      value={formData.collegeName}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-gray-800"
                      required={!isLogin}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-bold text-gray-700">University Roll / Reg No.</label>
                    <input 
                      type="text" 
                      name="rollNumber"
                      placeholder="e.g. 202201010" 
                      value={formData.rollNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-gray-800"
                      required={!isLogin}
                    />
                  </div>

                  {/* Naya: Hosteler ya Day Scholar Toggle */}
                  <div className="space-y-2 pt-1 pb-1">
                    <label className="text-sm font-bold text-gray-700">Student Type</label>
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input 
                          type="radio" 
                          name="studentType" 
                          value="Hosteler"
                          checked={formData.studentType === 'Hosteler'}
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className={`text-sm font-medium ${formData.studentType === 'Hosteler' ? 'text-blue-700 font-bold' : 'text-gray-600 group-hover:text-gray-800'}`}>
                          Hosteler
                        </span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input 
                          type="radio" 
                          name="studentType" 
                          value="Day Scholar"
                          checked={formData.studentType === 'Day Scholar'}
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className={`text-sm font-medium ${formData.studentType === 'Day Scholar' ? 'text-blue-700 font-bold' : 'text-gray-600 group-hover:text-gray-800'}`}>
                          Day Scholar
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Smart Conditional Rendering: Sirf Hosteler ko dikhega */}
                  {formData.studentType === 'Hosteler' && (
                    <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-700">Hostel Block</label>
                        <input 
                          type="text" 
                          name="hostelBlock"
                          placeholder="e.g. Block A" 
                          value={formData.hostelBlock}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-gray-800"
                          required={formData.studentType === 'Hosteler'}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-700">Room No.</label>
                        <input 
                          type="text" 
                          name="roomNumber"
                          placeholder="e.g. 302" 
                          value={formData.roomNumber}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-gray-800"
                          required={formData.studentType === 'Hosteler'}
                        />
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Shared Fields (Login & Register both) */}
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  placeholder="student@university.edu" 
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-gray-800"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Password</label>
                <input 
                  type="password" 
                  name="password"
                  placeholder="••••••••" 
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-gray-800"
                  required
                />
              </div>

              {isLogin && (
                <div className="flex justify-end">
                  <span className="text-sm font-bold text-blue-600 hover:text-blue-800 cursor-pointer transition-colors">
                    Forgot Password?
                  </span>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/40 transition-all active:scale-[0.98] mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Student Account')}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-500 font-medium">
                {isLogin ? "New to the platform?" : "Already have an account?"}
                <button 
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-2 text-blue-600 font-bold hover:underline focus:outline-none"
                >
                  {isLogin ? 'Register Here' : 'Login Instead'}
                </button>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;