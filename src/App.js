import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LearningModules from './pages/LearningModules';
import StudyMaterials from './pages/StudyMaterials';
import UserSubjects from './pages/UserSubjects';
import SubjectDetails from './pages/SubjectDetails';
import LessonDetails from './pages/LessonDetais';
import StartQuiz from './pages/StartQuiz';  



import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LearningModules />} />
          <Route path="/materials" element={<StudyMaterials />} />
          <Route path="/user-subjects" element={<UserSubjects />} />
          <Route path="/subject-details" element={<SubjectDetails />} />
          <Route path="/lesson-details" element={<LessonDetails />} /> 
          <Route path="/start-quiz" element={<StartQuiz />} /> 
          
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
