// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './components/HomePage';
import ChatBot from './components/ChatBot';
import WorkoutList from './components/WorkoutList';
import WorkoutDetail from './components/WorkoutDetail';
import './App.css';  // Make sure this is imported
import '@fontsource/plus-jakarta-sans/400.css';
import '@fontsource/plus-jakarta-sans/500.css';
import '@fontsource/plus-jakarta-sans/600.css';
import '@fontsource/plus-jakarta-sans/700.css';

require('dotenv').config({ path: '../.env.local' });

function App() {
  return (
    <Router>
      <div className="container">
        <nav>
          <Link to="/">Home</Link>
          <Link to="/chat">Chat Bot</Link>
          <Link to="/workouts">My Workouts</Link>
        </nav>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatBot />} />
          <Route path="/workouts" element={<WorkoutList />} />
          <Route path="/workouts/:id" element={<WorkoutDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
