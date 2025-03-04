// components/WorkoutDetail.js
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const WorkoutDetail = () => {
  const { id } = useParams();
  const [workout, setWorkout] = useState(null);

  const fetchWorkout = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/workouts/${id}`);
      setWorkout(response.data);
    } catch (error) {
      console.error("Error fetching workout details", error);
    }
  }, [id]);

  useEffect(() => {
    fetchWorkout();
  }, [fetchWorkout]);

  if (!workout) {
    return (
      <div className="page-content">
        <div className="card loading">Loading workout details...</div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="section">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 className="section-title" style={{ margin: 0, border: 'none' }}>{workout.workout_title}</h2>
            <button className="btn-primary">Edit Workout</button>
          </div>
          <p style={{ fontSize: '18px', color: 'var(--brown-light)', marginBottom: '32px' }}>{workout.message}</p>
          
          {workout.workout_schedule && workout.workout_schedule.map((schedule, index) => (
            <div key={index} className="card" style={{ marginBottom: '20px', backgroundColor: 'var(--background)' }}>
              <h3 style={{ color: 'var(--primary-coral)', marginBottom: '16px' }}>{schedule.day}</h3>
              <p style={{ marginBottom: '24px' }}>{schedule.workout_description}</p>
              
              <div style={{ display: 'grid', gap: '16px' }}>
                {schedule.workout && schedule.workout.map((exercise, idx) => (
                  <div 
                    key={idx}
                    style={{
                      padding: '20px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--white)',
                      border: '1px solid var(--primary-coral)',
                      boxShadow: '0 2px 4px rgba(70, 43, 37, 0.05)'
                    }}
                  >
                    <strong style={{ 
                      color: 'var(--primary-brown)',
                      fontSize: '18px',
                      display: 'block',
                      marginBottom: '8px'
                    }}>
                      {exercise.exercise_name}
                    </strong>
                    <p style={{ marginBottom: '12px' }}>{exercise.exercise_description}</p>
                    <div style={{ 
                      color: 'var(--primary-coral)',
                      fontWeight: '600',
                      display: 'flex',
                      gap: '16px'
                    }}>
                      <span><span style={{ color: 'var(--primary-brown)' }}>Sets: </span>{exercise.exercise_sets}</span>
                      <span><span style={{ color: 'var(--primary-brown)' }}>Reps: </span> {exercise.exercise_reps}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkoutDetail;
