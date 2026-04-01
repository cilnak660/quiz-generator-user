import React from 'react';
import { BookOpen, CheckCircle, PlayCircle, ChevronRight, Lock } from 'lucide-react';

const LearningModules = () => {
  const modules = [
    { id: 1, title: 'Introduction to React', description: 'Learn the fundamentals of UI creation with React.', progress: 100, status: 'completed' },
    { id: 2, title: 'State Management with Hooks', description: 'Master useState, useEffect, and custom hooks.', progress: 65, status: 'in-progress' },
    { id: 3, title: 'Tailwind CSS Fundamentals', description: 'Utility-first CSS for rapid UI development.', progress: 0, status: 'not-started' },
    { id: 4, title: 'Node.js & Express Basics', description: 'Build scalable backend infrastructure.', progress: 0, status: 'locked' },
    { id: 5, title: 'MongoDB Data Modeling', description: 'Design flexible NoSQL database schemas.', progress: 0, status: 'locked' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <BookOpen className="text-indigo-600" size={32} />
          Learning Modules
        </h2>
        <p className="text-slate-500">Access your course content and track topic-wise completion.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="divide-y divide-slate-100">
          {modules.map((module) => (
            <div key={module.id} className={`p-6 transition-colors ${module.status === 'locked' ? 'bg-slate-50/50' : 'hover:bg-slate-50 cursor-pointer group'}`}>
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between mb-4">
                <div className="flex items-start sm:items-center gap-4">
                  <div className={`mt-1 sm:mt-0 p-3 rounded-xl flex-shrink-0 ${
                    module.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 
                    module.status === 'in-progress' ? 'bg-indigo-50 text-indigo-600' : 
                    module.status === 'locked' ? 'bg-slate-100 text-slate-400' :
                    'bg-slate-50 text-slate-400 border border-slate-200'
                  }`}>
                    {module.status === 'completed' ? <CheckCircle size={24} /> : 
                     module.status === 'locked' ? <Lock size={24} /> :
                     <PlayCircle size={24} />}
                  </div>
                  <div>
                    <h3 className={`font-bold text-lg mb-1 ${module.status === 'locked' ? 'text-slate-500' : 'group-hover:text-indigo-700 transition-colors'}`}>
                      {module.id}. {module.title}
                    </h3>
                    <p className="text-sm text-slate-500 max-w-xl">{module.description}</p>
                  </div>
                </div>

                {module.status !== 'locked' && (
                  <div className="flex items-center w-full sm:w-auto ml-[52px] sm:ml-0 gap-4 shrink-0">
                     <div className="flex-1 sm:w-32">
                        <div className="flex justify-between text-xs mb-1 font-semibold text-slate-500">
                          <span>Progress</span>
                          <span>{module.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${module.status === 'completed' ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                            style={{ width: `${module.progress}%` }}
                          ></div>
                        </div>
                     </div>
                     <ChevronRight className="text-slate-400 group-hover:text-indigo-500 transition-transform group-hover:translate-x-1" size={20} />
                  </div>
                )}
                {module.status === 'locked' && (
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-lg ml-[52px] sm:ml-0">Locked</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearningModules;
