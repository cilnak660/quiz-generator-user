import React, { useEffect, useState } from 'react';
import {
    BookOpen,
    ChevronLeft,
    PlayCircle,
    Loader2,
    Clock,
    Signal,
    Star,
    CheckCircle2,
    GraduationCap,
    Download,
    ArrowRight,
    MessageSquare,
    Cpu,
    Brain,
    Globe
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { db } from '../Config/Config';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

const SubjectDetails = () => {
    const { id } = useParams();
    const [subject, setSubject] = useState(null);
    const [modules, setModules] = useState([]);
    const [activeModuleId, setActiveModuleId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubjectAndModules = async () => {
            setLoading(true);
            try {
                // Fetch Subject Details
                const subjectRef = doc(db, "subject", id);
                const subjectSnap = await getDoc(subjectRef);
                if (subjectSnap.exists()) {
                    setSubject({ id: subjectSnap.id, ...subjectSnap.data() });
                }

                // Fetch Modules for this subject
                const modulesQuery = query(collection(db, "module"), where("subject_id", "==", id));
                const modulesSnapshot = await getDocs(modulesQuery);
                const modulesData = modulesSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setModules(modulesData);
                if (modulesData.length > 0) {
                    setActiveModuleId(modulesData[0].id);
                }
            } catch (error) {
                console.error("Error fetching subject details:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchSubjectAndModules();
        }
    }, [id]);

    const activeModule = modules.find(m => m.id === activeModuleId);
    const masteryPercent = modules.length > 0 ? Math.round((modules.filter(m => m.status === 'completed').length / modules.length) * 100) : 33; // dummy fallback

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="animate-spin text-indigo-600" size={48} />
                <p className="text-slate-500 font-medium">Loading course curriculum...</p>
            </div>
        );
    }

    const icons = [Cpu, Brain, Globe];

    return (
        <div className="max-w-[1400px] mx-auto px-4 py-8">
            {/* Top Back Navigation */}
            <div className="flex items-center gap-4 text-sm font-bold text-slate-400 mb-8">
                <Link to="/user-subjects" className="flex items-center gap-1 hover:text-indigo-600 transition-colors">
                    <ChevronLeft size={20} /> Back to Subjects
                </Link>
                <span className="text-slate-200">/</span>
                <span className="text-slate-600">{subject?.name || "Subject"}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* LEFT SIDEBAR (4 cols) */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Modules List Card */}
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-8 pb-4 flex justify-between items-center">
                            <h2 className="text-2xl font-black text-slate-800">Modules</h2>
                            <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black tracking-widest rounded-lg">
                                {modules.length} Modules
                            </span>
                        </div>
                        <div className="p-4 space-y-3">
                            {modules.map((mod, idx) => {
                                const Icon = icons[idx % icons.length];
                                return (
                                    <button
                                        key={mod.id}
                                        onClick={() => setActiveModuleId(mod.id)}
                                        className={`w-full text-left p-5 rounded-2xl transition-all flex items-center gap-4 border-2 ${activeModuleId === mod.id
                                            ? 'bg-indigo-50/50 border-indigo-600/10 shadow-sm ring-1 ring-indigo-600/5'
                                            : 'bg-white border-transparent hover:bg-slate-50'
                                            }`}
                                    >
                                        <div className={`p-3 rounded-xl shrink-0 ${activeModuleId === mod.id ? 'bg-white shadow-sm text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                                            <Icon size={24} />
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <h4 className={`font-black text-sm mb-0.5 line-clamp-1 ${activeModuleId === mod.id ? 'text-indigo-700' : 'text-slate-700'}`}>
                                                {mod.name}
                                            </h4>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Subject: {subject?.name}</p>
                                        </div>
                                        {activeModuleId === mod.id && <div className="w-1.5 h-12 bg-indigo-600 absolute left-0 rounded-r-lg"></div>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Subject Mastery Progress Card */}
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 relative overflow-hidden group">
                        <div className="relative z-10">
                            <h2 className="text-xl font-black text-slate-800 mb-2">Subject Mastery</h2>
                            <p className="text-sm text-slate-500 font-medium mb-8 max-w-[200px]">
                                Complete all modules to earn your certification.
                            </p>

                            <div className="space-y-4">
                                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-indigo-600 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(79,70,229,0.3)]"
                                        style={{ width: `100%` }}
                                    ></div>
                                </div>
                                <span className="text-xs font-black text-indigo-600 tracking-widest uppercase">Complete the modules</span>
                            </div>
                        </div>
                        <GraduationCap className="absolute -right-4 -bottom-4 text-slate-50/10 w-48 h-48 -rotate-12 group-hover:scale-110 transition-transform duration-700" strokeWidth={0.5} fill="currentColor" opacity={0.05} />
                    </div>
                </div>

                {/* MAIN CONTENT AREA (8 cols) */}
                <div className="lg:col-span-8 flex flex-col gap-8">
                    {/* Header Image Area */}
                    <div className="relative h-[480px] rounded-[2.5rem] overflow-hidden bg-slate-900 shadow-2xl border-4 border-white">
                        <img
                            src="/assets/subject_header.png"
                            alt="Subject Visual"
                            className="w-full h-full object-cover opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

                        <div className="absolute bottom-12 left-12 right-12 z-10">
                            <span className="inline-block px-3 py-1.5 bg-indigo-600 text-white text-[10px] font-black tracking-[0.2em] uppercase rounded-lg mb-6 shadow-xl shadow-indigo-600/20">
                                CURRENT MODULE
                            </span>
                            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight">
                                {activeModule?.name || "Select a Module"}
                            </h1>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10 lg:p-14">
                        {/* Stats Row */}
                        {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 pb-12 border-b border-slate-100 mb-12">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">DURATION</p>
                                    <h4 className="text-lg font-black text-slate-800">4.5 Hours</h4>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                                    <Signal size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">DIFFICULTY</p>
                                    <h4 className="text-lg font-black text-slate-800">Intermediate</h4>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                                    <Star size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">CREDITS</p>
                                    <h4 className="text-lg font-black text-slate-800">12 Points</h4>
                                </div>
                            </div>
                        </div> */}

                        {/* Overview and Instructor Grid */}
                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
                            <div className="xl:col-span-12">
                                <h2 className="text-3xl font-black text-slate-800 mb-6">Overview</h2>
                                <p className="text-slate-500 text-lg leading-relaxed mb-8">
                                    {activeModule?.description || "Master these concepts through guided lessons and practical quizzes designed for deep mastery."}
                                </p>

                                <div className="space-y-4">
                                    {[
                                        "Detailed conceptual understanding of the core topics",
                                        "Practical implementations and real-world examples",
                                        "Interpreting metrics and refining model behaviors"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 text-slate-600 font-bold">
                                            <div className="bg-indigo-600 text-white rounded-full p-0.5">
                                                <CheckCircle2 size={16} />
                                            </div>
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* <div className="xl:col-span-5 bg-slate-50 rounded-3xl p-8 border border-slate-100 flex flex-col">
                                <h3 className="text-xl font-black text-slate-800 mb-6">Instructor</h3>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 bg-white rounded-2xl overflow-hidden border-2 border-white shadow-md">
                                        <img
                                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus"
                                            alt="Instructor"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-800 text-lg">Dr. Marcus Chen</h4>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Senior AI Researcher</p>
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-slate-200 mt-auto">
                                    <p className="text-sm font-medium text-slate-500 italic leading-relaxed">
                                        "Mastering {activeModule?.name || 'these modules'} is the first step toward building the future of autonomous systems."
                                    </p>
                                </div>
                            </div> */}
                        </div>

                        {/* Bottom Actions */}
                        <div className="mt-16 flex flex-col sm:flex-row items-center gap-4">
                            {/* <button className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 rounded-2xl font-black text-sm text-slate-700 hover:bg-slate-50 transition-all">
                                Preview Syllabus
                            </button>
                            <button className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 rounded-2xl font-black text-sm text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                                <Download size={18} />
                                Download Resources
                            </button> */}
                            <Link
                                to={activeModule ? `/lesson-details/${activeModule.id}` : '#'}
                                className="w-full sm:w-auto sm:ml-auto px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 group"
                            >
                                Go to Module Details
                                <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubjectDetails;