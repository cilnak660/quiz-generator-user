import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LearningModules from './pages/LearningModules';
import StudyMaterials from './pages/StudyMaterials';
import UserSubjects from './pages/UserSubjects';
import SubjectDetails from './pages/SubjectDetails';
import LessonDetails from './pages/LessonDetais';
import StartQuiz from './pages/StartQuiz';  
import Login from './pages/Login';
import { auth } from './Config/Config';
import { onAuthStateChanged } from 'firebase/auth';
import { Loader2 } from 'lucide-react';

import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/" element={user ? <LearningModules /> : <Navigate to="/login" />} />
          <Route path="/materials" element={user ? <StudyMaterials /> : <Navigate to="/login" />} />
          <Route path="/user-subjects" element={user ? <UserSubjects /> : <Navigate to="/login" />} />
          <Route path="/subject-details/:id" element={user ? <SubjectDetails /> : <Navigate to="/login" />} />
          <Route path="/lesson-details/:id" element={user ? <LessonDetails /> : <Navigate to="/login" />} /> 
          <Route path="/start-quiz/:quizId" element={user ? <StartQuiz /> : <Navigate to="/login" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
