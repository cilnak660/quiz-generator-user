import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    X,
    Clock,
    ShieldCheck,
    ChevronLeft,
    Bookmark,
    ArrowRight,
    LayoutGrid,
    AlertCircle,
    Loader2,
    Lightbulb,
    ExternalLink
} from 'lucide-react';
import { db } from '../Config/Config';
import { doc, getDoc, collection, getDocs, setDoc, serverTimestamp } from 'firebase/firestore';

const StartQuiz = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();

    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [reviewLater, setReviewLater] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = useCallback(async (auto = false) => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            let correctAnswersCount = 0;
            questions.forEach((q, index) => {
                if (selectedAnswers[index] === q.correctIndex) {
                    correctAnswersCount++;
                }
            });

            const score = Math.round((correctAnswersCount / questions.length) * 100);

            // Save result to Firestore
            const resultData = {
                quizId,
                quizName: quiz?.name,
                score,
                totalQuestions: questions.length,
                correctAnswers: correctAnswersCount,
                submittedAt: serverTimestamp(),
            };

            await setDoc(doc(db, "quiz_results", `${quizId}_${Date.now()}`), resultData);

            if (auto) {
                alert("Time's up! Your quiz has been automatically submitted.");
            } else {
                alert(`Quiz submitted successfully! Your score: ${score}%`);
            }

            navigate(-1);
        } catch (error) {
            console.error("Error submitting quiz: ", error);
            alert("Failed to submit quiz. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }, [quizId, quiz, questions, selectedAnswers, navigate, isSubmitting]);

    useEffect(() => {
        const fetchQuizAndQuestions = async () => {
            try {
                const quizDoc = await getDoc(doc(db, "module_test", quizId));
                if (quizDoc.exists()) {
                    const quizData = quizDoc.data();
                    setQuiz(quizData);
                    setTimeLeft(quizData.duration_in_sec || 600);

                    const questionsSnapshot = await getDocs(collection(db, "module_test", quizId, "questions"));
                    const questionsData = questionsSnapshot.docs.map(doc => {
                        const q = doc.data();
                        const options = [q.a, q.b, q.c, q.d];
                        const ansMap = { 'a': 0, 'b': 1, 'c': 2, 'd': 3 };
                        return {
                            id: doc.id,
                            questionText: q.question,
                            options,
                            correctIndex: ansMap[q.ans]
                        };
                    });
                    setQuestions(questionsData);
                }
            } catch (error) {
                console.error("Error fetching quiz data: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuizAndQuestions();
    }, [quizId]);

    useEffect(() => {
        if (timeLeft <= 0 && !loading && questions.length > 0) {
            handleSubmit(true);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, loading, questions, handleSubmit]);

    const handleOptionSelect = (optionIndex) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [currentQuestionIndex]: optionIndex
        }));
    };

    const toggleReviewLater = () => {
        setReviewLater(prev => ({
            ...prev,
            [currentQuestionIndex]: !prev[currentQuestionIndex]
        }));
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')} : ${s.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[100] gap-4">
                <Loader2 className="animate-spin text-indigo-600" size={60} />
                <p className="text-slate-500 font-black tracking-widest uppercase">Initializing Secure Session...</p>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const progressPercent = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
            {/* Quiz Header */}
            <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-50">
                <div className="max-w-[1600px] mx-auto flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-800 transition-colors"
                    >
                        <X size={20} /> Exit Quiz
                    </button>

                    <div className="absolute left-1/2 -translate-x-1/2">
                        <h1 className="text-2xl font-black text-indigo-600 tracking-tight">AI SkillMaster</h1>
                    </div>

                    <div className="flex items-center gap-10">
                        <div className="text-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">TIME REMAINING</p>
                            <h3 className={`text-2xl font-black tabular-nums ${timeLeft < 60 ? 'text-rose-600 animate-pulse' : 'text-slate-800'}`}>
                                {formatTime(timeLeft)}
                            </h3>
                        </div>
                        <div className="bg-indigo-50 text-indigo-600 px-5 py-2.5 rounded-2xl flex items-center gap-3 font-bold text-sm shadow-sm border border-indigo-100">
                            <ShieldCheck size={20} fill="currentColor" className="opacity-20 absolute" />
                            <ShieldCheck size={20} className="relative z-10" />
                            Proctored Session
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-[1600px] mx-auto w-full px-8 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Left Column: Progress & Question (8 cols) */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Status Card */}
                        <div className="bg-white rounded-[2rem] p-10 border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-800 mb-1">{quiz?.name}</h2>
                                    <p className="text-sm font-bold text-slate-400">Module Context: Specialized Learning Structures</p>
                                </div>
                                <div className="text-right">
                                    <h3 className="text-3xl font-black text-indigo-600">
                                        {(currentQuestionIndex + 1).toString().padStart(2, '0')} <span className="text-slate-300 text-2xl">/ {questions.length}</span>
                                    </h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Questions</p>
                                </div>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-indigo-600 transition-all duration-500 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.3)]"
                                    style={{ width: `${progressPercent}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Question Card */}
                        <div className="bg-white rounded-[2rem] p-10 border border-slate-200 shadow-sm relative">
                            <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-lg uppercase tracking-widest mb-10 inline-block">
                                Question {(currentQuestionIndex + 1).toString().padStart(2, '0')}
                            </span>

                            <h3 className="text-xl font-black text-slate-800 mb-10 leading-relaxed">
                                {currentQuestion?.questionText}
                            </h3>

                            {/* <div className="rounded-[1.5rem] overflow-hidden bg-slate-900 mb-10 border-4 border-white shadow-lg h-64">
                                <img src="/assets/quiz_placeholder.png" alt="Quiz Visual" className="w-full h-full object-cover opacity-60" />
                            </div> */}

                            <div className="space-y-4">
                                {currentQuestion?.options.map((option, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleOptionSelect(idx)}
                                        className={`w-full text-left p-6 rounded-2xl border-2 transition-all flex items-center gap-6 group ${selectedAnswers[currentQuestionIndex] === idx
                                            ? 'bg-indigo-50/50 border-indigo-600 ring-1 ring-indigo-600/10'
                                            : 'bg-white border-slate-100 hover:border-slate-300'
                                            }`}
                                    >
                                        <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center shrink-0 transition-all ${selectedAnswers[currentQuestionIndex] === idx
                                            ? 'border-indigo-600 bg-indigo-600'
                                            : 'border-slate-100 group-hover:border-slate-200 bg-white'
                                            }`}>
                                            {selectedAnswers[currentQuestionIndex] === idx && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                        </div>
                                        <span className={`text-base font-bold ${selectedAnswers[currentQuestionIndex] === idx ? 'text-indigo-700' : 'text-slate-600'}`}>
                                            {option}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Controls Area */}
                        <div className="flex items-center justify-between pt-6">
                            <button
                                disabled={currentQuestionIndex === 0}
                                onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                                className="flex items-center gap-3 px-8 py-4 bg-white border border-slate-200 rounded-2xl font-black text-sm text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                            >
                                <ChevronLeft size={20} /> Previous
                            </button>

                            <button
                                onClick={toggleReviewLater}
                                className={`flex items-center gap-2 px-8 py-4 bg-white border rounded-2xl font-black text-sm transition-all shadow-sm ${reviewLater[currentQuestionIndex] ? 'text-amber-600 border-amber-200 bg-amber-50' : 'text-slate-700 border-slate-200 hover:bg-slate-50'
                                    }`}
                            >
                                <Bookmark size={20} fill={reviewLater[currentQuestionIndex] ? 'currentColor' : 'none'} />
                                {reviewLater[currentQuestionIndex] ? 'Marked for Review' : 'Mark for Review'}
                            </button>

                            {currentQuestionIndex === questions.length - 1 ? (
                                <button
                                    onClick={() => handleSubmit()}
                                    disabled={isSubmitting}
                                    className="flex items-center gap-3 px-12 py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200"
                                >
                                    Finish Assessment <ArrowRight size={20} />
                                </button>
                            ) : (
                                <button
                                    onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                                    className="flex items-center gap-3 px-12 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
                                >
                                    Next Question <ArrowRight size={20} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Overview & Tips (4 cols) */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Question Overview Grid */}
                        <div className="bg-white rounded-[2rem] p-10 border border-slate-200 shadow-sm">
                            <h3 className="text-lg font-black text-slate-800 mb-8 flex items-center gap-3">
                                <LayoutGrid className="text-indigo-600" size={24} />
                                Question Overview
                            </h3>

                            <div className="grid grid-cols-5 gap-4">
                                {questions.map((_, idx) => {
                                    const isAnswered = selectedAnswers[idx] !== undefined;
                                    const isCurrent = currentQuestionIndex === idx;
                                    const isReview = reviewLater[idx];

                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentQuestionIndex(idx)}
                                            className={`relative h-12 rounded-xl text-sm font-black transition-all flex items-center justify-center border-2 ${isCurrent ? 'bg-white border-indigo-600 text-indigo-600 ring-2 ring-indigo-600/10' :
                                                isReview ? 'bg-amber-50 border-amber-200 text-amber-600' :
                                                    isAnswered ? 'bg-indigo-600 border-indigo-600 text-white' :
                                                        'bg-[#F8FAFC] border-transparent text-slate-400 hover:border-slate-200'
                                                }`}
                                        >
                                            {idx + 1}
                                            {isReview && <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-amber-400 rounded-full border-2 border-white"></div>}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="mt-12 space-y-4 border-t border-slate-100 pt-8">
                                <div className="flex items-center gap-3 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                    <div className="w-4 h-4 bg-indigo-600 rounded"></div>
                                    Answered ({Object.keys(selectedAnswers).length})
                                </div>
                                <div className="flex items-center gap-3 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                    <div className="w-4 h-4 bg-white border-2 border-indigo-600 rounded"></div>
                                    Current (1)
                                </div>
                                <div className="flex items-center gap-3 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                    <div className="w-4 h-4 bg-amber-50 border-2 border-amber-200 rounded"></div>
                                    Review Later ({Object.values(reviewLater).filter(Boolean).length})
                                </div>
                            </div>
                        </div>

                        {/* Tip Card */}
                        {/* <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                            <div className="relative z-10">
                                <Lightbulb className="mb-6 opacity-60 group-hover:scale-110 transition-transform" size={40} />
                                <h3 className="text-2xl font-black mb-4">Stuck on this?</h3>
                                <p className="text-indigo-100 font-medium mb-10 leading-relaxed opacity-80">
                                    Review the documentation on Specialized Neural Patterns for better conceptual understanding.
                                </p>
                                <button className="w-full bg-white text-indigo-700 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors shadow-lg">
                                    Open Mini-Docs <ExternalLink size={18} />
                                </button>
                            </div>
                          
                            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                        </div> */}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default StartQuiz;