// components/WorkoutList.js
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const WorkoutList = () => {
  const [workouts, setWorkouts] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const hasPosted = useRef(false);

  useEffect(() => {
    const postNewWorkout = async () => {
      // Only post if we have workout data and haven't posted it yet
      if (location.state?.workout && !hasPosted.current) {
        try {
          hasPosted.current = true;  // Mark as posted immediately to prevent double posting
          await axios.post("http://localhost:5000/workouts", location.state.workout);
          // Clear the location state
          navigate(location.pathname, { replace: true });
          // Fetch the updated list
          fetchWorkouts();
        } catch (err) {
          console.error(err);
          hasPosted.current = false;  // Reset if posting failed
        }
      }
    };

    postNewWorkout();
  }, [location.state, navigate, location.pathname]);

  const fetchWorkouts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/workouts");
      setWorkouts(response.data);
    } catch (error) {
      console.error("Error fetching workouts", error);
    }
  };

  // Initial fetch of workouts
  useEffect(() => {
    fetchWorkouts();
  }, []); // Only run once on mount

  return (
    <div className="page-content">
      <div className="section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="section-title">My Workouts</h2>
          <button 
            className="btn-primary"
            onClick={() => navigate('/chat', { state: { initialMode: 'workout' } })}
          >
            Create New Workout
          </button>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '20px', 
          marginTop: '20px' 
        }}>
          {workouts.map(workout => (
            <Link 
              to={`/workouts/${workout._id}`} 
              key={workout._id}
              style={{ textDecoration: 'none' }}
            >
              <div className="card card-hover" style={{ 
                height: '250px',
                position: 'relative',  // Add this for absolute positioning of child
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{ flex: 1 }}>  {/* This div will contain the title and message */}
                  <h3 style={{ 
                    color: 'var(--primary-brown)', 
                    marginBottom: '12px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {workout.workout_title}
                  </h3>
                  <p style={{ 
                    color: 'var(--brown-light)', 
                    marginBottom: '16px',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: '4',
                    WebkitBoxOrient: 'vertical',
                    textOverflow: 'ellipsis'
                  }}>
                    {workout.message}
                  </p>
                </div>
                <div style={{ 
                  backgroundColor: 'var(--coral-light)', 
                  color: 'var(--primary-brown)',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  display: 'inline-block',
                  fontSize: '14px',
                  fontWeight: '500',
                  position: 'absolute',  // Position at bottom
                  bottom: '32px'         // Match card padding
                }}>
                  View Details →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkoutList;
