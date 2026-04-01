import React, { useState } from 'react';
import { BookOpen, ChevronLeft, PlayCircle, FileText, BrainCircuit, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const SubjectDetails = () => {
    const [activeLesson, setActiveLesson] = useState(1);

    const lessons = [
        { 
            id: 1, 
            title: "Introduction to Advanced Patterns", duration: "45 mins", completed: true,
            material: "",
            quizScore: 90
        },
        { 
            id: 2, 
            title: "Higher-Order Components (HOCs)", duration: "1.5 hours", completed: false,
            material: "A Higher-Order Component is an advanced technique in React for reusing component logic. Let's look at how HOCs differ from custom hooks.",
            quizScore: null
        },
        { 
            id: 3, 
            title: "Render Props & Component Injection", duration: "1 hour", completed: false,
            material: "Understand how the 'render prop' technique can help you share state and behavior between functionally un-related components.",
            quizScore: null
        },
        { 
            id: 4, 
            title: "Performance Optimization Techniques", duration: "2 hours", completed: false,
            material: "Learn about React.memo, useMemo, useCallback, and how to effectively debug unnecessary re-renders using the React Profiler.",
            quizScore: null
        },
        { 
            id: 5, 
            title: "Custom Hooks & Architecture", duration: "1.5 hours", completed: false,
            material: "We will build highly reusable custom hooks while maintaining pure component architectures. Includes comprehensive PDF guides.",
            quizScore: null
        }
    ];

    const currentLesson = lessons.find(l => l.id === activeLesson);

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header / Back Link */}
            <div className="mb-8">
                <Link to="/user-subjects" className="text-sm font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1 w-fit mb-4 transition-colors">
                    <ChevronLeft size={16} /> Back to Subjects
                </Link>
                
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">Course</span>
                            <span className="text-slate-500 text-sm font-semibold flex items-center gap-1"><Clock size={14}/> 6.5 hours</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-800">Advanced React Patterns</h1>
                        <p className="text-slate-500 text-lg mt-2 max-w-2xl">Master React by diving deep into advanced patterns, architecture, and performance optimization.</p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 min-w-[200px]">
                        <div className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                            <span>Your Progress</span>
                            <span className="text-indigo-600">20%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                            <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                        </div>
                        <p className="text-xs text-slate-400 mt-2 font-medium">1 of 5 lessons completed</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Side: Lesson List */}
                <div className="lg:col-span-1 space-y-3">
                    <h3 className="font-bold text-lg text-slate-800 mb-4 px-2">Course Content</h3>
                    {lessons.map((lesson) => (
                        <Link
                            key={lesson.id}
                            to="/lesson-details"
                            className={`w-full text-left p-4 rounded-2xl border transition-all flex gap-3 ${
                                activeLesson === lesson.id 
                                    ? 'bg-indigo-50 border-indigo-200 shadow-sm' 
                                    : 'bg-white border-slate-100 hover:border-indigo-100 hover:shadow-sm'
                            }`}
                        >
                            <div className={`mt-1 shrink-0 ${lesson.completed ? 'text-emerald-500' : 'text-slate-300'}`}>
                                {lesson.completed ? <CheckCircle size={20} /> : <PlayCircle size={20} />}
                            </div>
                            <div>
                                <h4 className={`font-bold text-sm leading-tight mb-1 ${activeLesson === lesson.id ? 'text-indigo-700' : 'text-slate-700'}`}>
                                    {lesson.id}. {lesson.title}
                                </h4>
                                <span className="text-xs font-semibold text-slate-400">{lesson.duration}</span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Right Side: Active Lesson Detail Area */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                        {/* Lesson Info */}
                        <div className="p-8">
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">Lesson {currentLesson.id}: {currentLesson.title}</h2>
                            <p className="text-slate-600 leading-relaxed mb-8">
                                {currentLesson.material}
                            </p>


                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubjectDetails;