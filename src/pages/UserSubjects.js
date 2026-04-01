import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, ChevronRight, LayoutList, Database, Server, PenTool } from 'lucide-react';

const UserSubjects = () => {
    const subjects = [
        { 
            id: 1, 
            name: 'Advanced React Patterns', 
            lessons: 15, 
            duration: '6.5 hours', 
            progress: 45, 
            bgColor: 'bg-blue-50', 
            iconColor: 'text-blue-600',
            barColor: 'bg-blue-500',
            icon: LayoutList
        },
        { 
            id: 2, 
            name: 'Node.js Backend Architecture', 
            lessons: 24, 
            duration: '10 hours', 
            progress: 12, 
            bgColor: 'bg-emerald-50', 
            iconColor: 'text-emerald-600',
            barColor: 'bg-emerald-500',
            icon: Server
        },
        { 
            id: 3, 
            name: 'UI/UX Design Fundamentals', 
            lessons: 8, 
            duration: '3 hours', 
            progress: 100, 
            bgColor: 'bg-rose-50', 
            iconColor: 'text-rose-600',
            barColor: 'bg-emerald-500', // complete
            icon: PenTool
        },
        { 
            id: 4, 
            name: 'MongoDB Data Modeling', 
            lessons: 12, 
            duration: '4.5 hours', 
            progress: 0, 
            bgColor: 'bg-indigo-50', 
            iconColor: 'text-indigo-600',
            barColor: 'bg-indigo-500',
            icon: Database
        }
    ];

    return (
        <div>
            {/* Header */}
            <div className="mb-10 items-start md:items-center justify-between flex flex-col md:flex-row gap-4">
                <div>
                    <h2 className="text-3xl font-bold mb-2 flex items-center gap-3 text-slate-800">
                        <BookOpen className="text-indigo-600" size={32} />
                        Your Subjects
                    </h2>
                    <p className="text-slate-500 text-lg">Pick up where you left off or start a new topic.</p>
                </div>
            </div>

            {/* Grid of Subjects */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {subjects.map((subject) => {
                    const Icon = subject.icon;
                    return (
                        <div key={subject.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col group">
                            <div className="flex items-start gap-4 mb-4">
                                <div className={`p-4 rounded-2xl ${subject.bgColor} ${subject.iconColor} shrink-0`}>
                                    <Icon size={28} />
                                </div>
                                <div className="flex-1 mt-1">
                                    <h3 className="font-bold text-xl text-slate-800 mb-1 leading-tight group-hover:text-indigo-600 transition-colors">
                                        {subject.name}
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
                                        <span className="flex items-center gap-1.5"><BookOpen size={16} /> {subject.lessons} Lessons</span>
                                        <span className="flex items-center gap-1.5"><Clock size={16} /> {subject.duration}</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Progress Area */}
                            <div className="mt-auto pt-4">
                                <div className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                                    <span>Course Progress</span>
                                    <span>{subject.progress}%</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2.5 mb-6">
                                    <div 
                                        className={`h-2.5 rounded-full ${subject.barColor}`}
                                        style={{ width: `${subject.progress}%` }}
                                    ></div>
                                </div>
                                
                                <Link to="/subject-details" className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                                    subject.progress === 100 
                                        ? 'bg-slate-50 text-slate-600 hover:bg-slate-100' 
                                        : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white'
                                }`}>
                                    {subject.progress === 100 ? 'Review Subject' : subject.progress === 0 ? 'Start Learning' : 'Continue Learning'}
                                    <ChevronRight size={18} />
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};  

export default UserSubjects;