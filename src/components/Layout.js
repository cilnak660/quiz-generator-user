import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, BrainCircuit, FileText, Menu, X, LayoutDashboard, Compass, LogOut, User } from 'lucide-react';
import { auth, db } from '../Config/Config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const Layout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const isLoginPage = location.pathname === '/login';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Fetch additional data from Firestore
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setUser({ ...currentUser, ...userDoc.data() });
        } else {
          setUser(currentUser);
        }
      } else {
        setUser(null);
      }
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, [navigate, isLoginPage]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Academic Path', href: '/user-subjects', icon: Compass },
    { name: 'Resource Library', href: '/materials', icon: FileText },
  ];

  const isActive = (path) => {
    return location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
  };

  if (isLoginPage) {
    return <div className="min-h-screen bg-[#F8FAFC]">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Desktop Navigation */}
      <nav className={`hidden md:block sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200/50' : 'bg-[#F8FAFC] border-b border-transparent'}`}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">

            {/* Branding */}
            <div className="flex items-center gap-10">
              <Link to="/" className="flex items-center gap-4 group">
                <div className="bg-indigo-600 p-2.5 rounded-2xl text-white shadow-lg shadow-indigo-200 group-hover:scale-105 group-hover:shadow-indigo-300 transition-all">
                  <BrainCircuit size={28} />
                </div>
                <div>
                  <h1 className="text-xl font-black text-slate-800 leading-tight tracking-tight group-hover:text-indigo-600 transition-colors">Quiz Generator</h1>
                </div>
              </Link>

              {/* Nav Links */}
              <div className="hidden lg:flex items-center space-x-2 bg-white/50 backdrop-blur-sm px-2 py-1.5 rounded-2xl border border-slate-200/50">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2.5 transition-all duration-200 ${active
                        ? 'bg-white text-indigo-700 shadow-sm border border-slate-100 ring-1 ring-slate-900/5'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
                        }`}
                    >
                      <Icon size={18} className={active ? 'text-indigo-600' : 'text-slate-400'} />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-5">
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 pl-5 border-l border-slate-200 cursor-pointer group">
                    <div className="text-right hidden xl:block">
                      <p className="text-sm font-black text-slate-800">{user.displayName || 'Student'}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Member</p>
                    </div>
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="Profile" referrerPolicy="no-referrer" className="w-12 h-12 rounded-2xl shadow-md group-hover:shadow-lg transition-all object-cover p-0.5 bg-white border border-slate-100" />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5 shadow-md group-hover:shadow-lg transition-all">
                        <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-indigo-600 font-black text-sm uppercase">
                          {user.displayName ? user.displayName.charAt(0) : <User size={20} />}
                        </div>
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
                    title="Sign Out"
                  >
                    <LogOut size={22} />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100">
                  Sign In
                </Link>
              )}
            </div>

          </div>
        </div>
      </nav>

      {/* Mobile Navigation Header */}
      <nav className={`md:hidden sticky top-0 z-50 transition-all ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200' : 'bg-[#F8FAFC] border-b border-transparent'}`}>
        <div className="px-5 flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-md">
              <BrainCircuit size={24} />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-800 leading-tight">Quiz Generator</h1>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            {user && (
              <button 
                onClick={handleLogout}
                className="p-2 text-slate-400"
              >
                <LogOut size={20} />
              </button>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 text-slate-600 bg-white rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
          <div
            className="absolute top-20 left-4 right-4 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in slide-in-from-top-4 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-5 py-4 rounded-2xl text-base font-black flex items-center gap-4 transition-colors ${active
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                  >
                    <Icon size={24} className={active ? 'text-indigo-600' : 'text-slate-400'} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
