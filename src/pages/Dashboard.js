import React from 'react';
import { BookOpen, BrainCircuit, LineChart, Trophy, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const recentQuizzes = [
    { id: 1, title: 'React Basics', score: 85, date: '2 days ago' },
    { id: 2, title: 'JavaScript ES6+', score: 92, date: '1 week ago' },
  ];

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Welcome back, John! 👋</h2>
        <p className="text-slate-500">Continue learning and track your progress with your AI generated quizzes.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="bg-blue-100 p-4 rounded-xl text-blue-600">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Modules Completed</p>
            <p className="text-2xl font-bold">12 / 24</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="bg-indigo-100 p-4 rounded-xl text-indigo-600">
            <BrainCircuit size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Quizzes Taken</p>
            <p className="text-2xl font-bold">8</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="bg-emerald-100 p-4 rounded-xl text-emerald-600">
            <Trophy size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Average Score</p>
            <p className="text-2xl font-bold">88%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Start Section */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold mb-4">Pick Up Where You Left Off</h3>
            <div className="bg-gradient-to-r from-slate-50 to-indigo-50 border border-indigo-100 rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-lg text-slate-800">State Management with Hooks</h4>
                  <p className="text-sm text-slate-600 mb-2">Module 4 • React Advanced Course</p>
                  <div className="flex items-center gap-3">
                    <div className="w-48 bg-white rounded-full h-2 border border-slate-200">
                      <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    <span className="text-xs font-semibold text-indigo-600">65% complete</span>
                  </div>
                </div>
                <Link to="/modules" className="bg-indigo-600 text-white font-bold py-2.5 px-6 rounded-xl hover:bg-indigo-700 transition-colors shrink-0 text-center">
                  Continue
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="absolute right-0 top-0 opacity-10 translate-x-1/4 -translate-y-1/4">
              <BrainCircuit size={200} />
            </div>
            <div className="relative z-10 max-w-sm">
              <h3 className="text-2xl font-bold mb-2">Test Your Knowledge</h3>
              <p className="text-indigo-100 text-sm leading-relaxed mb-4">Let our AI analyze your learning progress and generate a custom quiz specially for you.</p>
              <Link to="/quiz" className="bg-white text-indigo-700 font-bold py-3 px-6 rounded-xl shadow-sm hover:shadow-md hover:bg-slate-50 transition-all inline-flex items-center gap-2">
                <BrainCircuit size={18} />
                Generate AI Quiz Now
              </Link>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <LineChart className="text-indigo-500" size={20} />
                Recent Quizzes
              </h3>
            </div>
            
            <div className="space-y-4">
              {recentQuizzes.map((quiz) => (
                <div key={quiz.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                  <div>
                    <p className="font-semibold text-sm">{quiz.title}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <Clock size={12} /> {quiz.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center justify-center font-bold text-sm bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
                      {quiz.score}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <Link to="/quiz" className="w-full mt-4 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors flex items-center justify-center gap-1 py-2">
              View Quiz History <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
