import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ContentAIPage from './components/ContentAIPage';
import MarketingPage from './components/MarketingPage';
import CompliancePage from './components/CompliancePage';
import AITrainingPage from './components/AITrainingPage';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserData(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserData = async (token) => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading AI Commerce Platform...</div>;
  }

  return (
    <Router>
      <div className="app">
        <Sidebar user={user} />
        <div className="main-content">
          <Header user={user} setUser={setUser} />
          <Routes>
            <Route path="/" element={<Dashboard user={user} />} />
            <Route path="/content-ai" element={<ContentAIPage />} />
            <Route path="/marketing" element={<MarketingPage />} />
            <Route path="/compliance" element={<CompliancePage />} />
            <Route path="/ai-training" element={<AITrainingPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
