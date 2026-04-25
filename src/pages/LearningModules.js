import React, { useEffect, useState } from 'react';
import { GraduationCap, CheckCircle, Clock, Sparkles, BarChart2, BrainCircuit, MessageSquare, Eye, Scale, ChevronRight, Loader2 } from 'lucide-react';
import { db } from '../Config/Config';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const MODULE_STYLES = [
  { icon: Sparkles, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { icon: BarChart2, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { icon: BrainCircuit, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { icon: MessageSquare, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { icon: Eye, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { icon: Scale, color: 'text-indigo-600', bg: 'bg-indigo-50' }
];

const attachDummyStatus = (module, index) => {
  let status = 'locked';
  let progress = 0;
  if (index === 0) { status = 'completed'; progress = 100; }
  else if (index === 1) { status = 'in-progress'; progress = 45; }

  return { ...module, status: module.status || status, progress: module.progress || progress };
};

const LearningModules = () => {
  const [modules, setModules] = useState([]);
  const [stats, setStats] = useState({ subjects: 0, modules: 0, materials: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [modulesSnap, subjectsSnap, materialsSnap] = await Promise.all([
          getDocs(collection(db, "module")),
          getDocs(collection(db, "subject")),
          getDocs(collection(db, "material"))
        ]);

        const modulesData = modulesSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setModules(modulesData);
        setStats({
          subjects: subjectsSnap.size,
          modules: modulesSnap.size,
          materials: materialsSnap.size
        });
      } catch (error) {
        console.error("Error fetching dashboard data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
        <p className="text-slate-500 font-medium">Initializing Learning Path...</p>
      </div>
    );
  }

  return (
    <div className="pb-12">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 text-slate-800">Learning Modules</h2>
        <p className="text-slate-500 text-lg">Access your course content and track topic-wise completion.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="bg-indigo-50 text-indigo-600 p-4 rounded-2xl shrink-0">
            <GraduationCap fill="currentColor" className="text-indigo-100" size={28} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Subjects</p>
            <h3 className="font-bold text-slate-800 text-lg">{stats.subjects} Active Subjects</h3>
          </div>
        </div>
        <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="bg-emerald-50 text-emerald-500 p-4 rounded-2xl shrink-0">
            <CheckCircle fill="currentColor" className="text-emerald-100" size={28} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Learning Modules</p>
            <h3 className="font-bold text-slate-800 text-lg">{stats.modules} Core Modules</h3>
          </div>
        </div>
        <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="bg-amber-50 text-amber-500 p-4 rounded-2xl shrink-0">
            <Clock fill="currentColor" className="text-amber-100" size={28} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Reference Materials</p>
            <h3 className="font-bold text-slate-800 text-lg">{stats.materials} Study Docs</h3>
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {modules.map((m, index) => {
          const module = attachDummyStatus(m, index);
          const style = MODULE_STYLES[index % MODULE_STYLES.length];
          const Icon = style.icon;

          return (
            <div
              key={module.id}
              onClick={() => navigate(`/lesson-details/${module.id}`)}
              className="bg-white rounded-[2rem] p-7 border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all cursor-pointer group flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl ${style.bg} ${style.color}`}>
                  <Icon size={24} fill="currentColor" className="opacity-20 absolute" />
                  <Icon size={24} className="relative z-10" />
                </div>
                <ChevronRight className="text-slate-300 group-hover:text-indigo-500 transition-colors mt-2 mr-2" size={20} />
              </div>

              <h3 className="font-bold text-lg text-slate-800 mb-2 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-1">{module.name}</h3>
              <p className="text-sm text-slate-500 mb-8 flex-1 line-clamp-2">{module.description}</p>

              <div className="mt-auto">
                <div className="flex justify-between items-end mb-3">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${module.status === 'completed' ? 'text-indigo-600' :
                    module.status === 'in-progress' ? 'text-slate-400' : 'text-slate-400'
                    }`}>
                    {/* {module.status === 'completed' ? 'Completed' : module.status === 'in-progress' ? 'In Progress' : 'Locked'} */}Start Learning
                  </span>
                  {/* <span className={`text-sm tracking-wide ${module.status === 'locked' ? 'text-slate-400' : 'text-indigo-600'}`}>
                    {module.progress}%
                  </span> */}
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-1000 ${module.status === 'locked' ? 'bg-transparent' : 'bg-indigo-600'}`}
                    style={{ width: `100%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Banner */}
      <div className="relative rounded-[2.5rem] overflow-hidden bg-slate-900 border-4 border-white shadow-xl">
        <div className="absolute inset-0">
          <img src="/assets/banner.png" alt="Generative AI Masterclass" className="w-full h-full object-cover opacity-70 mix-blend-luminosity" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
        </div>
        <div className="relative z-10 p-10 md:p-14 lg:p-16 max-w-2xl">
          <span className="inline-block px-3 py-1.5 bg-indigo-500/20 text-indigo-300 text-[10px] font-bold tracking-widest uppercase rounded-lg mb-5 border border-indigo-500/30 backdrop-blur-sm">
            New Content
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-5 leading-tight tracking-tight">
            Generative Quiz Generator
          </h2>
          <p className="text-slate-300 text-lg mb-10 max-w-lg leading-relaxed mix-blend-lighten">
            Explore the mechanics of Large Language Models and Diffusion techniques.
          </p>
          <button className="bg-white text-slate-900 font-bold px-8 py-3.5 rounded-xl hover:bg-slate-100 hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)]"
            onClick={() => navigate('/user-subjects')}
          >
            Start Learning
          </button>
        </div>
      </div>
    </div>
  );
};

export default LearningModules;
