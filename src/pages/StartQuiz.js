import React, { useState } from 'react';
import { ChevronLeft, BrainCircuit, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const StartQuiz = () => {
    const [answers, setAnswers] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    const questions = [
        { 
            id: 1, 
            text: "What is the primary role of the virtual DOM in React?", 
            options: [
                "A strict replacement for the actual DOM", 
                "A lightweight copy of the real DOM kept in memory", 
                "A tool exclusively used for backend rendering", 
                "A mechanism to mutate the state directly"
            ], 
            correctIndex: 1 
        },
        { 
            id: 2, 
            text: "Which hook should be used to perform side effects?", 
            options: [
                "useContext", 
                "useReducer", 
                "useState", 
                "useEffect"
            ], 
            correctIndex: 3 
        },
        { 
            id: 3, 
            text: "What does a Higher-Order Component (HOC) return?", 
            options: [
                "A function that returns a new component", 
                "A boolean indicating if render was successful", 
                "A new DOM element", 
                "An array of child props"
            ], 
            correctIndex: 0 
        }
    ];

    const handleSelectOption = (questionId, optionIndex) => {
        if (!isSubmitted) {
            setAnswers(prev => ({
                ...prev,
                [questionId]: optionIndex
            }));
        }
    };

    const calculateScore = () => {
        let score = 0;
        questions.forEach(q => {
            if (answers[q.id] === q.correctIndex) {
                score++;
            }
        });
        return Math.round((score / questions.length) * 100);
    };

    const handleSubmit = () => {
        if (Object.keys(answers).length < questions.length) {
            const confirmMsg = "You haven't answered all questions. Submit anyway?";
            if (!window.confirm(confirmMsg)) return;
        }
        setIsSubmitted(true);
    };

    const getOptionStyle = (question, optIndex) => {
        const isSelected = answers[question.id] === optIndex;
        
        if (!isSubmitted) {
            return isSelected 
                ? 'border-indigo-500 bg-indigo-50 shadow-sm' 
                : 'border-slate-200 bg-white hover:border-indigo-200 hover:bg-slate-50';
        }

        const isCorrect = question.correctIndex === optIndex;
        
        if (isCorrect) {
            return 'border-emerald-500 bg-emerald-50 font-bold';
        }
        if (isSelected && !isCorrect) {
            return 'border-rose-500 bg-rose-50';
        }
        
        return 'border-slate-100 bg-slate-50 opacity-60';
    };

    return (
        <div className="max-w-3xl mx-auto pb-20">
            {/* Header / Back Link */}
            <div className="mb-8">
                <Link to="/lesson-details" className="text-sm font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1 w-fit mb-4 transition-colors">
                    <ChevronLeft size={16} /> Exit Quiz
                </Link>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="bg-indigo-100 text-indigo-700 p-3 rounded-xl hidden sm:block">
                            <BrainCircuit size={28} />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Knowledge Check: Theory</h1>
                            <p className="text-slate-500 text-sm mt-1">{questions.length} Questions • Multiple Choice</p>
                        </div>
                    </div>
                    {isSubmitted && (
                        <div className="bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm text-center">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Final Score</p>
                            <p className={`text-2xl font-black ${calculateScore() >= 50 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {calculateScore()}%
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Questions List */}
            <div className="space-y-8">
                {questions.map((q, index) => (
                    <div key={q.id} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex gap-3">
                            <span className="text-indigo-500 shrink-0">{index + 1}.</span> 
                            {q.text}
                        </h3>
                        
                        <div className="space-y-3">
                            {q.options.map((opt, optIndex) => {
                                const isSelected = answers[q.id] === optIndex;
                                const isCorrect = q.correctIndex === optIndex;
                                const showCorrectIcon = isSubmitted && isCorrect;
                                const showWrongIcon = isSubmitted && isSelected && !isCorrect;

                                return (
                                    <button 
                                        key={optIndex}
                                        onClick={() => handleSelectOption(q.id, optIndex)}
                                        disabled={isSubmitted}
                                        className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between gap-4 cursor-pointer ${getOptionStyle(q, optIndex)}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                                isSelected && !isSubmitted ? 'border-indigo-600' : 
                                                showCorrectIcon ? 'border-emerald-600 bg-emerald-600' : 
                                                showWrongIcon ? 'border-rose-600 bg-rose-600' : 
                                                'border-slate-300'
                                            }`}>
                                                {isSelected && !isSubmitted && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full"></div>}
                                                {showCorrectIcon && <CheckCircle size={14} className="text-white" />}
                                                {showWrongIcon && <XCircle size={14} className="text-white" />}
                                            </div>
                                            <span className={`font-medium ${
                                                showCorrectIcon ? 'text-emerald-900' : 
                                                showWrongIcon ? 'text-rose-900' : 
                                                'text-slate-700'
                                            }`}>
                                                {opt}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Actions */}
            <div className="mt-10 flex justify-end">
                {!isSubmitted ? (
                    <button 
                        onClick={handleSubmit}
                        className="bg-indigo-600 text-white font-bold px-10 py-4 rounded-xl shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all"
                    >
                        Submit Quiz
                    </button>
                ) : (
                    <Link 
                        to="/lesson-details"
                         className="bg-slate-800 text-white font-bold px-10 py-4 rounded-xl shadow-md hover:bg-slate-900 hover:shadow-lg transition-all"
                    >
                        Return to Lesson
                    </Link>
                )}
            </div>
        </div>
    );
};

export default StartQuiz;