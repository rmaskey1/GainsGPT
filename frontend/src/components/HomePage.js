// components/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="page-content">
      <div className="section">
        <h1 className="section-title">Welcome to <span style={{ color: 'var(--coral-dark)' }}>GainsGPT</span></h1>
        
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginTop: '40px'
        }}>
          <div className="card card-hover">
            <h3 style={{ color: 'var(--primary-brown)', marginBottom: '16px' }}>
              AI Workout Assistant
            </h3>
            <p style={{ color: 'var(--brown-light)', marginBottom: '24px' }}>
              Get personalized workout recommendations using our AI-powered chat assistant.
            </p>
            <Link to="/chat">
              <button className="btn-primary">Start Chat</button>
            </Link>
          </div>

          <div className="card card-hover">
            <h3 style={{ color: 'var(--primary-brown)', marginBottom: '16px' }}>
              My Workouts
            </h3>
            <p style={{ color: 'var(--brown-light)', marginBottom: '24px' }}>
              View and manage your saved workout routines.
            </p>
            <Link to="/workouts">
              <button className="btn-primary">View Workouts</button>
            </Link>
          </div>
        </div>

        <div className="card" style={{ marginTop: '40px' }}>
          <h2 style={{ color: 'var(--primary-brown)', marginBottom: '16px' }}>
            How It Works
          </h2>
          <div style={{ display: 'grid', gap: '20px' }}>
            <div style={{ 
              padding: '20px', 
              backgroundColor: 'var(--background)', 
              borderRadius: '8px' 
            }}>
              <h3 style={{ color: 'var(--primary-coral)', marginBottom: '8px' }}>1. Chat with AI</h3>
              <p>Describe your fitness goals and preferences to our AI assistant.</p>
            </div>
            <div style={{ 
              padding: '20px', 
              backgroundColor: 'var(--background)', 
              borderRadius: '8px' 
            }}>
              <h3 style={{ color: 'var(--primary-coral)', marginBottom: '8px' }}>2. Get Recommendations</h3>
              <p>Receive personalized workout plans tailored to your needs.</p>
            </div>
            <div style={{ 
              padding: '20px', 
              backgroundColor: 'var(--background)', 
              borderRadius: '8px' 
            }}>
              <h3 style={{ color: 'var(--primary-coral)', marginBottom: '8px' }}>3. Track Progress</h3>
              <p>Save and manage your workout routines in one place.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
