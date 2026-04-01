import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, BrainCircuit, FileText, Home, Menu, X } from 'lucide-react';

const Layout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Learning Modules', href: '/', icon: BookOpen },
    { name: 'Study Materials', href: '/materials', icon: FileText },
    { name: 'Your Subjects', href: '/user-subjects', icon: BookOpen },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Desktop Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-3 mr-4">
                <div className="bg-indigo-600 p-2 rounded-lg text-white">
                  <BrainCircuit size={24} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-800 leading-tight">AI Skill Platform</h1>
                  <p className="text-xs text-slate-500 font-medium">KOSHYS INSTITUTE EXCELLENCE</p>
                </div>
              </Link>

              <div className="hidden lg:flex items-center space-x-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors ${
                        isActive(item.href)
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <Icon size={18} />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border-2 border-indigo-200">
                JD
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Header */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm md:hidden">
        <div className="px-4 flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-md text-white">
              <BrainCircuit size={20} />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-800 leading-tight">AI Skill Platform</h1>
            </div>
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-md"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-slate-800/20 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="absolute top-16 left-0 w-full bg-white border-b border-slate-200 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="px-4 py-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-base font-semibold flex items-center gap-3 transition-colors ${
                      isActive(item.href)
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon size={20} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
