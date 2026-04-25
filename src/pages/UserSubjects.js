import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    BookOpen,
    ChevronRight,
    Layers,
    Clock,
    MoreVertical,
    SlidersHorizontal,
    Plus,
    Loader2,
    Search,
    ChevronLeft
} from 'lucide-react';
import { db } from '../Config/Config';
import { collection, getDocs } from 'firebase/firestore';
import bgimage from '../assets/sl_031420_28950_10.jpg';

const UserSubjects = () => {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const subjectsSnapshot = await getDocs(collection(db, "subject"));
                const subjectsData = subjectsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setSubjects(subjectsData);
            } catch (error) {
                console.error("Error fetching subjects:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSubjects();
    }, []);

    const getBadgeInfo = (index) => {
        const badges = ['CORE', 'ADVANCED', 'ELECTIVE', 'PRACTICAL'];
        return badges[index % badges.length];
    };

    const getSubjectImage = (index) => {
        // Using high-quality placeholder images for tech subjects
        const images = [
            'https://images.unsplash.com/photo-1551288049-bbbda536ad0b?auto=format&fit=crop&q=80&w=1000', // data
            'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=1000', // nodes
            'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=1000', // code
            'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1000', // ai
            'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1000', // matrix
        ];
        return images[index % images.length];
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="animate-spin text-indigo-600" size={48} />
                <p className="text-slate-500 font-medium">Loading your academic path...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-4">
                <span className="hover:text-indigo-600 cursor-pointer transition-colors">DASHBOARD</span>
                <span className="text-slate-300">/</span>
                <span className="text-indigo-600">CURRICULUM</span>
            </nav>

            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
                <div className="max-w-7xl">
                    <h1 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">Your Academic Path</h1>
                    <p className="text-slate-500 text-sm leading-relaxed">
                        Manage your specialized learning tracks and monitor your progression through complex technical subjects.
                    </p>
                </div>
                {/* <div className="flex items-center gap-3 shrink-0">
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
                        <SlidersHorizontal size={18} />
                        Filter
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200">
                        <Plus size={18} />
                        Enroll New Subject
                    </button>
                </div> */}
            </div>

            {/* Subjects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {subjects.map((subject, index) => {
                    const progress = subject.progress || (index === 0 ? 65 : index === 1 ? 30 : 0);
                    return (
                        <div key={subject.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden flex flex-col h-full">
                            {/* Card Image Wrapper */}
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={bgimage}
                                    alt={subject.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute top-4 right-4">
                                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-black tracking-widest rounded-lg border border-white/20">
                                        {getBadgeInfo(index)}
                                    </span>
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="p-8 flex flex-col flex-1">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-2xl font-black text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-1">
                                        {subject.name}
                                    </h3>
                                    <button className="text-slate-400 hover:text-indigo-600 transition-colors p-1">
                                        <MoreVertical size={20} />
                                    </button>
                                </div>

                                <div className="flex items-center gap-5 text-sm font-bold text-slate-400 mb-8">
                                    <div className="flex items-center gap-2">
                                        <Layers size={16} />
                                        <span>{subject.number_of_module || 0} Modules</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock size={16} />
                                        <span>{(subject.number_of_module || 0) * 4} Hours</span>
                                    </div>
                                </div>

                                {/* Progress Area */}
                                <div className="mb-10">
                                    <div className="flex justify-between items-end mb-3 font-black tracking-widest text-[9px] uppercase">
                                        <span className="text-slate-400">MASTERY PROGRESS</span>
                                        <span className="text-indigo-600 text-xs">{progress}%</span>
                                    </div>
                                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-indigo-600 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(79,70,229,0.4)]"
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <Link
                                    to={`/subject-details/${subject.id}`}
                                    className="mt-auto w-full py-4 bg-indigo-50 text-indigo-700 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-indigo-600 hover:text-white transition-all group-hover:shadow-lg active:scale-95"
                                >
                                    View Subject
                                    <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </div>
                    );
                })}


            </div>

            {/* Pagination / Footer Info */}

        </div>
    );
};

export default UserSubjects;