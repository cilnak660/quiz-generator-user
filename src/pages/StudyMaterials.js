import React, { useEffect, useState } from 'react';
import { FileText, Download, Search, Loader2, BookOpen, ExternalLink } from 'lucide-react';
import { db } from '../Config/Config';
import { collection, getDocs } from 'firebase/firestore';

const StudyMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const materialsSnapshot = await getDocs(collection(db, "material"));
        const materialsData = materialsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMaterials(materialsData);
      } catch (error) {
        console.error("Error fetching materials:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  const filteredMaterials = materials.filter(mat =>
    mat.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
        <p className="text-slate-500 font-black tracking-widest uppercase text-sm">Loading Resources...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto pb-20 px-6 mt-6">
      {/* Premium Header Section */}
      <div className="bg-white rounded-[2.5rem] p-10 lg:p-14 mb-12 shadow-sm border border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-10 relative overflow-hidden">
        {/* Abstract Background Element */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-indigo-50/50 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 text-[10px] font-black tracking-[0.2em] uppercase rounded-lg mb-4">
            Resource Library
          </span>
          <h2 className="text-4xl md:text-2xl font-black text-slate-800 mb-4 tracking-tight">
            Study Materials
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Access an extensive collection of tutorials, reference notes, and class resources to accelerate your learning.
          </p>
        </div>

        <div className="relative z-10 w-full lg:w-auto min-w-[320px]">
          <div className="relative bg-white rounded-2xl shadow-xl shadow-slate-200/50 hover:shadow-indigo-100 transition-all">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
            <input
              type="text"
              placeholder="Search by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-6 py-5 rounded-2xl border-2 border-transparent focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition-all font-bold text-slate-700 bg-slate-50 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredMaterials.map((mat) => {
          return (
            <div key={mat.id} className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 hover:border-indigo-100 transition-all duration-300 group flex flex-col h-full relative cursor-pointer">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl bg-rose-50 text-rose-600 transition-transform duration-300 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white`}>
                  <FileText size={32} />
                </div>
                <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-3 py-1.5 rounded-lg tracking-widest uppercase">
                  PDF DOC
                </span>
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-black text-slate-800 mb-2 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors" title={mat.title}>
                  {mat.title}
                </h3>
                <p className="text-sm font-bold text-slate-400 mb-8">{mat.subTitle || '4.2 MB'}</p>
              </div>

              <div className="flex items-center gap-3 mt-auto">
                <a
                  href={mat.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-indigo-50 text-indigo-700 text-center py-4 rounded-xl font-black text-sm hover:bg-indigo-600 hover:text-white transition-all shadow-md hover:shadow-indigo-200 flex items-center justify-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  View <ExternalLink size={16} />
                </a>
                <a
                  href={mat.pdf_url}
                  download
                  className="p-4 bg-white border-2 border-slate-100 text-slate-600 rounded-xl hover:bg-slate-50 hover:border-slate-200 transition-all shadow-sm group/btn"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Download size={20} className="group-hover/btn:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>
          );
        })}
        {filteredMaterials.length === 0 && (
          <div className="col-span-full p-20 text-center text-slate-400 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center">
            <BookOpen size={64} className="mb-6 opacity-30 text-indigo-600" />
            <h3 className="text-2xl font-black text-slate-800 mb-2">No materials found</h3>
            <p className="text-lg text-slate-500 font-medium max-w-md mx-auto">Try adjusting your search query, or check back later for new resources.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyMaterials;
