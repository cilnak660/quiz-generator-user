import React, { useEffect, useState } from 'react';
import {
    ChevronLeft,
    FileText,
    Download,
    BrainCircuit,
    Clock,
    Loader2,
    BookOpen,
    Settings,
    FileStack,
    CheckCircle2,
    ShieldCheck,
    Layout,
    Database,
    Zap,
    ExternalLink
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { db } from '../Config/Config';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';

const LessonDetails = () => {
    const { id } = useParams();
    const [module, setModule] = useState(null);
    const [quizzes, setQuizzes] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchModuleData = async () => {
            try {
                // Fetch Module Details
                const moduleRef = doc(db, "module", id);
                const moduleSnap = await getDoc(moduleRef);
                if (moduleSnap.exists()) {
                    setModule(moduleSnap.data());
                }

                // Fetch Quizzes
                const quizzesQuery = query(collection(db, "module_test"), where("module_id", "==", id));
                const quizzesSnapshot = await getDocs(quizzesQuery);
                const quizzesPromises = quizzesSnapshot.docs.map(async (quizDoc) => {
                    const data = quizDoc.data();
                    const questionsSnapshot = await getDocs(collection(db, "module_test", quizDoc.id, "questions"));
                    return {
                        id: quizDoc.id,
                        ...data,
                        questionsCount: questionsSnapshot.size
                    };
                });
                const quizzesData = await Promise.all(quizzesPromises);
                setQuizzes(quizzesData);

                // Fetch Materials
                const materialsQuery = query(collection(db, "material"), where("module_id", "==", id));
                const materialsSnapshot = await getDocs(materialsQuery);
                const materialsData = materialsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setMaterials(materialsData);

            } catch (error) {
                console.error("Error fetching module details: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchModuleData();
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="animate-spin text-indigo-600" size={48} />
                <p className="text-slate-500 font-medium">Loading module content...</p>
            </div>
        );
    }

    const quizIcons = [Layout, Database, Zap];

    return (
        <div className="max-w-[1400px] mx-auto px-6 py-10">
            {/* Header & Navigation */}
            <div className="mb-12">
                <Link to={`/subject-details/${module?.subject_id}`} className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 w-fit mb-6 transition-colors">
                    <ChevronLeft size={20} /> Back to Modules
                </Link>

                <h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-4 tracking-tight">
                    {module?.name || "Module Details"}
                </h1>
                <p className="text-slate-500 text-lg max-w-3xl leading-relaxed">
                    {module?.description || "Access specialized lessons and quizzes to master this topic."}
                </p>
            </div>

            <div className="flex flex-col gap-12 items-start max-w-5xl mx-auto">
                {/* STUDY MATERIALS Section */}
                <div className="w-full space-y-10">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
                            <BookOpen className="text-indigo-600" size={28} />
                            Study Materials
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {materials.length > 0 ? (
                                materials.map((file) => (
                                    <div key={file.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center gap-5 group hover:shadow-md transition-shadow">
                                        <div className="bg-rose-50 p-4 rounded-2xl text-rose-600 shrink-0 transition-transform group-hover:scale-105">
                                            <FileText size={32} />
                                        </div>
                                        <div className="flex-1 w-full overflow-hidden text-center sm:text-left">
                                            <h3 className="font-black text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors line-clamp-1">{file.title}</h3>
                                            <p className="text-xs font-bold text-slate-400">PDF • {file.subTitle || '4.2 MB'}</p>

                                            <div className="flex items-center justify-center sm:justify-start gap-3 mt-4">
                                                <a
                                                    href={file.pdf_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex-1 max-w-[140px] bg-indigo-600 text-white text-center py-2.5 rounded-xl font-bold text-xs hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
                                                >
                                                    View Online
                                                </a>
                                                <a
                                                    href={file.pdf_url}
                                                    download
                                                    className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all shadow-sm"
                                                >
                                                    <Download size={18} />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full p-12 text-center text-slate-400 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
                                    <BookOpen className="mx-auto mb-4 opacity-50" size={48} />
                                    <p className="font-medium">No study materials at this time.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* LESSON QUIZZES Section */}
                <div className="w-full space-y-10">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
                            <Settings className="text-indigo-600" size={28} />
                            Lesson Quizzes
                        </h2>

                        <div className="grid grid-cols-1 gap-6">
                            {quizzes.length > 0 ? (
                                quizzes.map((quiz, idx) => {
                                    const Icon = quizIcons[idx % quizIcons.length];
                                    return (
                                        <div key={quiz.id} className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 border-l-4 border-l-indigo-600 group hover:shadow-md transition-all">
                                            <div className="flex items-start md:items-center gap-6 w-full md:w-auto">
                                                <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                                                    <Icon size={32} />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-3 py-1 rounded-lg tracking-widest">
                                                            {idx === 0 ? 'BEGINNER' : 'INTERMEDIATE'}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-xl font-black text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">{quiz.name}</h3>
                                                    <div className="flex items-center gap-5 text-sm font-bold text-slate-400 uppercase tracking-tight">
                                                        <span className="flex items-center gap-1.5"><FileText size={16} /> {quiz.questionsCount} Questions</span>
                                                        <span className="flex items-center gap-1.5"><Clock size={16} /> {Math.floor((quiz.duration_in_sec || 0) / 60)} mins</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="w-full md:w-auto mt-4 md:mt-0 shrink-0">
                                                <Link to={`/start-quiz/${quiz.id}`} className="block w-full md:w-auto text-center bg-indigo-600 text-white font-black px-10 py-4 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                                                    Start Quiz
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="p-16 text-center text-slate-400 bg-white shadow-sm rounded-[2rem] border border-slate-100 flex flex-col items-center">
                                    <Settings size={48} className="mb-4 opacity-30 text-indigo-600" />
                                    <p className="font-medium text-lg text-slate-500">No quizzes configured yet.</p>
                                    <p className="text-sm mt-2">Assessments for this module will appear here.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Final Certification Hero Card */}
                    {/* <div className="bg-indigo-600 rounded-[2.5rem] p-10 lg:p-14 shadow-2xl relative overflow-hidden group">
                        <div className="relative z-10 lg:pr-[240px]">
                            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Final Certification Assessment</h2>
                            <p className="text-indigo-100 text-lg font-medium opacity-80 mb-10 leading-relaxed">
                                Ready to prove your mastery? Take the final comprehensive exam to earn your {module?.name || 'course'} certificate.
                            </p>

                            <div className="flex flex-wrap items-center gap-8 mb-10">
                                <div className="flex items-center gap-2.5 text-white font-black text-sm uppercase tracking-widest">
                                    <ShieldCheck size={24} className="text-indigo-300" />
                                    Official Certificate
                                </div>
                                <div className="flex items-center gap-2.5 text-white font-black text-sm uppercase tracking-widest">
                                    <Clock size={24} className="text-indigo-300" />
                                    60 Minutes
                                </div>
                            </div>

                            <button className="bg-white text-indigo-700 font-black px-12 py-5 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/20 flex items-center gap-3">
                                Begin Assessment
                                <ExternalLink size={20} />
                            </button>
                        </div>

                        <div className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-[320px] h-[240px] opacity-20 lg:opacity-100 transition-all duration-700 group-hover:scale-110 group-hover:rotate-2">
                            <div className="bg-white p-2 rounded-xl shadow-2xl skew-y-3">
                                <img src="/assets/certificate.png" alt="Certificate Preview" className="w-full h-full object-cover rounded-lg" />
                            </div>
                        </div>
                    </div> */}
                </div>

            </div>
        </div>
    );
};

export default LessonDetails;