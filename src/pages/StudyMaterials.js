import React from 'react';
import { FileText, Download, Search, Presentation, Video } from 'lucide-react';

const StudyMaterials = () => {
  const materials = [
    { id: 1, title: 'React Lifecycle Cheatsheet', category: 'Document', size: '1.2 MB', icon: FileText, color: 'text-rose-500', bg: 'bg-rose-50' },
    { id: 2, title: 'State Management Presentation', category: 'Slides', size: '4.5 MB', icon: Presentation, color: 'text-amber-500', bg: 'bg-amber-50' },
    { id: 3, title: 'Tailwind Grid System', category: 'Document', size: '0.8 MB', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 4, title: 'Node/Express Architecture', category: 'Diagram', size: '2.1 MB', icon: FileText, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { id: 5, title: 'MongoDB Indexing Tutorial', category: 'Video', size: '145 MB', icon: Video, color: 'text-purple-500', bg: 'bg-purple-50' },
    { id: 6, title: 'Capstone Project Guidelines', category: 'Document', size: '3.3 MB', icon: FileText, color: 'text-slate-500', bg: 'bg-slate-100' },
  ];

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <FileText className="text-indigo-600" size={32} />
            Study Materials
          </h2>
          <p className="text-slate-500">Download tutorials, reference notes, and class resources.</p>
        </div>
        
        <div className="relative max-w-xs w-full">
          <input 
            type="text" 
            placeholder="Search materials..." 
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
          />
          <Search className="absolute left-3 top-3 text-slate-400" size={18} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {materials.map((mat) => {
          const Icon = mat.icon;
          return (
            <div key={mat.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all hover:-translate-y-1 group flex flex-col h-full cursor-pointer hover:border-indigo-100">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-4 rounded-xl ${mat.bg} ${mat.color}`}>
                  <Icon size={28} />
                </div>
                <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-600 rounded-lg">
                  {mat.category}
                </span>
              </div>
              
              <h3 className="font-bold text-lg mb-1 text-slate-800 line-clamp-2">{mat.title}</h3>
              <p className="text-sm text-slate-500 mb-6">{mat.size}</p>
              
              <div className="mt-auto pt-4 border-t border-slate-100">
                <button className="w-full flex items-center justify-center gap-2 text-indigo-600 font-semibold hover:bg-indigo-50 py-2 rounded-lg transition-colors">
                  <Download size={18} />
                  Download
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudyMaterials;
