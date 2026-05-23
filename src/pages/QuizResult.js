import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    CheckCircle2,
    XCircle,
    Clock,
    AlertTriangle,
    Loader2,
    Award,
    HelpCircle,
    Info,
    BookOpen
} from 'lucide-react';
import { db } from '../Config/Config';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';

const QuizResult = () => {
    const { resultId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [moduleId, setModuleId] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResultData = async () => {
            try {
                // Fetch the quiz result doc
                const resultDocRef = doc(db, "quiz_results", resultId);
                const resultDocSnap = await getDoc(resultDocRef);

                if (!resultDocSnap.exists()) {
                    setError("Quiz result not found.");
                    setLoading(false);
                    return;
                }

                const resultData = resultDocSnap.data();
                setResult(resultData);

                const quizId = resultData.quizId;

                // Fetch parent module_test to get module_id for back link
                const quizDocRef = doc(db, "module_test", quizId);
                const quizDocSnap = await getDoc(quizDocRef);
                if (quizDocSnap.exists()) {
                    setModuleId(quizDocSnap.data().module_id);
                }

                // Fetch questions for this quiz
                const questionsSnapshot = await getDocs(collection(db, "module_test", quizId, "questions"));
                const questionsData = questionsSnapshot.docs.map(doc => {
                    const q = doc.data();
                    const options = [q.a, q.b, q.c, q.d];
                    const ansMap = { 'a': 0, 'b': 1, 'c': 2, 'd': 3 };
                    return {
                        id: doc.id,
                        questionText: q.question,
                        options,
                        correctIndex: ansMap[q.ans],
                        explanation: q.explanation || null
                    };
                });
                setQuestions(questionsData);

            } catch (err) {
                console.error("Error fetching quiz results detailed view:", err);
                setError("An error occurred while loading the results.");
            } finally {
                setLoading(false);
            }
        };

        fetchResultData();
    }, [resultId]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
                <Loader2 className="animate-spin text-indigo-600" size={48} />
                <p className="text-slate-500 font-medium">Generating performance analysis...</p>
            </div>
        );
    }

    if (error || !result) {
        return (
            <div className="max-w-md mx-auto my-12 text-center p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <AlertTriangle className="text-rose-500 mx-auto mb-4" size={48} />
                <h2 className="text-2xl font-black text-slate-800 mb-2">Error Loading Results</h2>
                <p className="text-slate-500 mb-6">{error || "We couldn't retrieve this quiz result."}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="bg-indigo-600 text-white font-black px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
                >
                    Go Back
                </button>
            </div>
        );
    }

    // Format date submitted
    let submittedDateString = "N/A";
    if (result.submittedAt) {
        try {
            const date = result.submittedAt.toDate ? result.submittedAt.toDate() : new Date(result.submittedAt);
            submittedDateString = date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
        } catch (e) {
            console.error(e);
        }
    }

    const hasSelectedAnswers = result.selectedAnswers && Object.keys(result.selectedAnswers).length > 0;
    const isPassed = result.score >= 60;

    return (
        <div className="max-w-[1000px] mx-auto px-6 py-10">
            {/* Header & Back Link */}
            <div className="mb-8">
                {moduleId ? (
                    <Link to={`/lesson-details/${moduleId}`} className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 w-fit mb-6 transition-colors">
                        <ChevronLeft size={20} /> Back to Module Details
                    </Link>
                ) : (
                    <button onClick={() => navigate(-1)} className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 w-fit mb-6 transition-colors">
                        <ChevronLeft size={20} /> Back
                    </button>
                )}

                <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
                    Quiz Performance Review
                </h1>
                <p className="text-slate-500 mt-1 flex items-center gap-1.5 text-sm font-bold">
                    <Clock size={16} /> Submitted on {submittedDateString}
                </p>
            </div>

            {/* Performance Overview Banner Card */}
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8 md:p-10 mb-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                    
                    {/* Score Circle Panel */}
                    <div className="md:col-span-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-100 pb-6 md:pb-0 md:pr-6">
                        <div className={`w-36 h-36 rounded-full flex flex-col items-center justify-center border-[10px] ${isPassed ? 'border-emerald-500 bg-emerald-50/30' : 'border-rose-500 bg-rose-50/30'}`}>
                            <span className="text-3xl font-black text-slate-800">{result.correctAnswers}/{result.totalQuestions}</span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Score</span>
                        </div>
                    </div>

                    {/* Stats & Description Panel */}
                    <div className="md:col-span-8 space-y-4">
                        <div className="flex items-center gap-3">
                            <span className={`px-4 py-1.5 rounded-xl font-black text-xs uppercase tracking-wider ${isPassed ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                {isPassed ? 'Passed' : 'Needs Review'}
                            </span>
                            <span className="text-slate-400 font-bold text-sm">Quiz: {result.quizName}</span>
                        </div>

                        <h2 className="text-2xl font-black text-slate-800">
                            {isPassed ? 'Congratulations! You Passed.' : 'Keep practicing to master this module!'}
                        </h2>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Questions</p>
                                <p className="text-xl font-black text-slate-700 mt-1">{result.totalQuestions}</p>
                            </div>
                            <div className="bg-emerald-50/40 p-4 rounded-2xl border border-emerald-100/50">
                                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Correct Answers</p>
                                <p className="text-xl font-black text-emerald-700 mt-1">{result.correctAnswers}</p>
                            </div>
                            <div className="bg-rose-50/40 p-4 rounded-2xl border border-rose-100/50 col-span-2 sm:col-span-1">
                                <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Incorrect Answers</p>
                                <p className="text-xl font-black text-rose-700 mt-1">{result.totalQuestions - result.correctAnswers}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fallback Notice for older / incomplete data */}
            {!hasSelectedAnswers && (
                <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200 text-amber-800 flex items-start gap-4 mb-10">
                    <Info className="text-amber-600 shrink-0 mt-0.5" size={24} />
                    <div>
                        <h4 className="font-black text-base mb-1">Detailed response view is unavailable</h4>
                        <p className="text-sm text-amber-700 leading-relaxed font-medium">
                            This result was recorded before detailed option tracking was enabled. Below you can see the quiz questions and correct answers for study, but your specific chosen options were not stored.
                        </p>
                    </div>
                </div>
            )}

            {/* Question Breakdown Section */}
            <div className="space-y-8">
                <h3 className="text-2xl font-black text-slate-800 flex items-center gap-2.5">
                    <BookOpen className="text-indigo-600" size={24} />
                    Detailed Response Breakdown
                </h3>

                {questions.map((question, qIdx) => {
                    const userSelectedIdx = hasSelectedAnswers ? result.selectedAnswers[question.id] : undefined;
                    const isCorrect = userSelectedIdx === question.correctIndex;
                    const isUnanswered = userSelectedIdx === undefined || userSelectedIdx === null;

                    return (
                        <div key={question.id} className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                            
                            {/* Correct/Incorrect/Unanswered Border Indicator */}
                            <div className={`absolute top-0 left-0 bottom-0 w-2 ${isUnanswered ? 'bg-slate-300' : isCorrect ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>

                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                                <div className="flex-1">
                                    <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black rounded-lg uppercase tracking-widest mb-3 inline-block">
                                        Question {(qIdx + 1).toString().padStart(2, '0')}
                                    </span>
                                    <h4 className="text-lg font-black text-slate-800 leading-relaxed">
                                        {question.questionText}
                                    </h4>
                                </div>

                                <div className="shrink-0 flex items-center gap-2">
                                    {!hasSelectedAnswers ? (
                                        <span className="bg-slate-100 border border-slate-200 text-slate-500 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                                            <HelpCircle size={16} /> Reference Question
                                        </span>
                                    ) : isUnanswered ? (
                                        <span className="bg-amber-50 border border-amber-200 text-amber-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                                            <AlertTriangle size={16} /> Unanswered
                                        </span>
                                    ) : isCorrect ? (
                                        <span className="bg-emerald-50 border border-emerald-200 text-emerald-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                                            <CheckCircle2 size={16} /> Correct
                                        </span>
                                    ) : (
                                        <span className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                                            <XCircle size={16} /> Incorrect
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Options List */}
                            <div className="grid grid-cols-1 gap-3.5 mb-6">
                                {question.options.map((option, optIdx) => {
                                    const isCorrectOpt = optIdx === question.correctIndex;
                                    const isUserChoice = optIdx === userSelectedIdx;

                                    let optionStyle = "border-slate-100 hover:border-slate-200 bg-slate-50/50 text-slate-600";
                                    let BadgeIcon = null;
                                    let badgeText = "";
                                    let badgeStyle = "";

                                    if (isCorrectOpt) {
                                        optionStyle = "border-emerald-300 bg-emerald-50/40 text-emerald-800 font-bold";
                                        badgeText = "Correct Answer";
                                        badgeStyle = "bg-emerald-100 text-emerald-800 border-emerald-200";
                                        BadgeIcon = CheckCircle2;
                                    }

                                    if (isUserChoice) {
                                        if (isCorrectOpt) {
                                            optionStyle = "border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20 font-bold";
                                            badgeText = "Your Correct Answer";
                                            badgeStyle = "bg-emerald-600 text-white border-transparent";
                                        } else {
                                            optionStyle = "border-rose-400 bg-rose-50/40 text-rose-800 font-bold";
                                            badgeText = "Your Answer (Incorrect)";
                                            badgeStyle = "bg-rose-600 text-white border-transparent";
                                            BadgeIcon = XCircle;
                                        }
                                    }

                                    return (
                                        <div
                                            key={optIdx}
                                            className={`p-5 rounded-2xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${optionStyle}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 font-bold text-sm ${
                                                    isUserChoice ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-500'
                                                }`}>
                                                    {String.fromCharCode(65 + optIdx)}
                                                </div>
                                                <span className="text-base">{option}</span>
                                            </div>

                                            {badgeText && (
                                                <span className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider border shrink-0 flex items-center gap-1.5 w-fit ${badgeStyle}`}>
                                                    {BadgeIcon && <BadgeIcon size={12} />}
                                                    {badgeText}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Question Explanation Box */}
                            {question.explanation && (
                                <div className="mt-4 p-5 bg-indigo-50/30 rounded-2xl border border-indigo-100/50 text-indigo-950 flex gap-3.5 items-start">
                                    <Info className="text-indigo-600 shrink-0 mt-0.5" size={20} />
                                    <div>
                                        <h5 className="font-black text-sm text-indigo-900 mb-1 uppercase tracking-wider">Explanation</h5>
                                        <p className="text-sm font-medium leading-relaxed text-indigo-950/80">{question.explanation}</p>
                                    </div>
                                </div>
                            )}

                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default QuizResult;
