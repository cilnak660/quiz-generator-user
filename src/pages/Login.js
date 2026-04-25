import React from 'react';
import { signInWithPopup } from 'firebase/auth';
import { db, auth, provider } from '../Config/Config';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, LogIn } from 'lucide-react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const Login = () => {
    const navigate = useNavigate();

    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Save or update user in Firestore
            const userRef = doc(db, 'users', user.uid);
            await setDoc(userRef, {
                uid: user.uid,
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                lastLogin: serverTimestamp(),
            }, { merge: true });

            console.log('User signed in and saved:', user.displayName);
            navigate('/'); // Redirect to dashboard
        } catch (error) {
            console.error('Error during Google sign-in:', error);
            alert('Failed to sign in. Please try again.');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-[32px] shadow-2xl shadow-indigo-100 border border-slate-100 overflow-hidden relative group">
                {/* Decorative Background Elements */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-50 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity"></div>
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-50 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity"></div>

                <div className="relative p-8 md:p-12 text-center">
                    {/* Logo Section */}
                    <div className="flex justify-center mb-8">
                        <div className="bg-indigo-600 p-4 rounded-3xl text-white shadow-xl shadow-indigo-200 transform hover:scale-105 transition-transform duration-300">
                            <BrainCircuit size={48} />
                        </div>
                    </div>

                    {/* Content Section */}
                    <h2 className="text-3xl font-black text-slate-800 mb-2 tracking-tight">Welcome Back</h2>
                    <p className="text-slate-500 font-medium mb-10">Sign in to access your personalized learning path and quizzes.</p>

                    {/* Google Sign In Button */}
                    <button
                        onClick={handleGoogleSignIn}
                        className="w-full group flex items-center justify-center gap-4 bg-white hover:bg-slate-50 text-slate-700 font-bold py-4 px-6 rounded-2xl border-2 border-slate-100 hover:border-indigo-100 transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                        <svg className="w-6 h-6" viewBox="0 0 48 48">
                            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                        </svg>
                        <span>Sign in with Google</span>
                    </button>

                    {/* Footer Info */}
                    <div className="mt-10 pt-8 border-t border-slate-50">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                            <LogIn size={12} /> Secure Authentication
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
