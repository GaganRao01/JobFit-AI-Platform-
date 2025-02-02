import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import JobSearch from './components/JobSearch';
import JobDetails from './components/JobDetails';
import Auth from './components/Auth';
import ResumeTailor from './components/ResumeTailor';
import { SupabaseContext } from './context/SupabaseContext';

function App() {
  const { session } = useContext(SupabaseContext);

  return (
    <Router>
      <Routes>
        <Route path="/" element={session ? <Navigate to="/dashboard" /> : <Auth />} />
        <Route path="/dashboard" element={session ? <Dashboard /> : <Navigate to="/" />} />
         <Route path="/search" element={session ? <JobSearch /> : <Navigate to="/" />} />
        <Route path="/job/:id" element={session ? <JobDetails /> : <Navigate to="/" />} />
        <Route path="/tailor" element={session ? <ResumeTailor /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
