import React from 'react';
import { ChevronLeft, FileText, Download, BrainCircuit, PlayCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const LessonDetails = () => {
    const materials = [
        { id: 1, name: 'Lesson Slides - Introduction', size: '2.4 MB', type: 'PDF' },
        { id: 2, name: 'Reference Notes & Cheat Sheet', size: '1.1 MB', type: 'PDF' }
    ];

    const quizzes = [
        { id: 1, name: 'Knowledge Check: Theory', questions: 10, duration: '15 mins', completed: false },
        { id: 2, name: 'Coding Challenge Quiz', questions: 5, duration: '30 mins', completed: true, score: 95 }
    ];

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header & Back Navigation */}
            <div className="mb-8">
                <Link to="/subject-details" className="text-sm font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1 w-fit mb-4 transition-colors">
                    <ChevronLeft size={16} /> Back to Course
                </Link>
                
                <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">1. Introduction to Advanced Patterns</h1>
                <p className="text-slate-500 text-lg">Master the essential theories of React rendering and reconcilliation before you dive in.</p>
            </div>

            {/* Study Materials Section */}
            <div className="mb-10">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <FileText className="text-indigo-600" />
                    Study Materials
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {materials.map((file) => (
                        <div key={file.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group cursor-pointer flex gap-4">
                            <div className="bg-rose-50 p-3 rounded-xl text-rose-600 h-fit">
                                <FileText size={24} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors line-clamp-1">{file.name}</h3>
                                <p className="text-xs font-semibold text-slate-400 mb-3">{file.type} • {file.size}</p>
                                <button className="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                                    <Download size={14} /> Download
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quizzes Section */}
            <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <BrainCircuit className="text-indigo-600" />
                    Lesson Quizzes
                </h2>
                <div className="space-y-4">
                    {quizzes.map((quiz) => (
                        <div key={quiz.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className={`p-4 rounded-xl ${quiz.completed ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                                    <BrainCircuit size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-800 mb-1">{quiz.name}</h3>
                                    <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
                                        <span className="flex items-center gap-1"><FileText size={14}/> {quiz.questions} Questions</span>
                                        <span className="flex items-center gap-1"><Clock size={14}/> {quiz.duration}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="w-full sm:w-auto mt-2 sm:mt-0">
                                {quiz.completed ? (
                                    <div className="flex items-center justify-between sm:justify-end gap-4 w-full">
                                        <div className="text-right">
                                            <p className="text-xs text-slate-500 font-semibold mb-1">Previous Score</p>
                                            <span className="bg-emerald-100 text-emerald-700 text-sm font-bold px-3 py-1 rounded-full">{quiz.score}%</span>
                                        </div>
                                        <Link to="/start-quiz" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors px-4 py-2 border border-slate-200 rounded-xl hover:border-indigo-200">
                                            Retake Quiz
                                        </Link>
                                    </div>
                                ) : (
                                    <Link to="/start-quiz" className="w-full sm:w-auto bg-indigo-600 text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center gap-2">
                                        <PlayCircle size={18} /> Start Quiz
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LessonDetails;