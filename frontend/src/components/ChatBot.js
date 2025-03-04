// components/ChatBot.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const ChatBot = () => {
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatType, setChatType] = useState(location.state?.initialMode || 'general');
  const navigate = useNavigate();

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setIsLoading(true);
    const userMessage = { sender: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await axios.post("http://localhost:5000/chat", {
        message: input,
        isWorkoutRequest: chatType === 'workout'
      });
      
      let botContent = response.data.choices[0].message.content;
      let workoutData = null;

      // If this is a workout request, try to parse the content as JSON
      if (chatType === 'workout') {
        try {
          const parsedWorkout = JSON.parse(botContent);
          if (parsedWorkout.workout_title) {
            workoutData = parsedWorkout;
            // Keep the workout data in the content for display
            botContent = JSON.stringify(parsedWorkout);
            // Add a friendly message after the workout preview
            setMessages(prev => [...prev, { 
              sender: 'bot', 
              content: botContent,
              workout: workoutData
            }, {
              sender: 'bot',
              content: "I've created this workout plan for you! Would you like to save it?"
            }]);
            setIsLoading(false);
            setInput("");
            return; // Exit early since we've already set messages
          }
        } catch (e) {
          // If parsing fails, keep the original content
          console.log("Not a JSON workout response");
        }
      }

      setMessages(prev => [...prev, { 
        sender: 'bot', 
        content: botContent,
        workout: workoutData  // Only include workout data if it's valid
      }]);
    } catch (error) {
      console.error("Error sending message", error);
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        content: "Error retrieving response." 
      }]);
    } finally {
      setIsLoading(false);
      setInput("");
    }
  };

  const formatWorkoutMessage = (content) => {
    try {
      // Check if the content is JSON
      const workoutData = JSON.parse(content);
      if (workoutData.workout_title) {
        return (
          <div>
            <h3 style={{ 
              color: 'inherit', 
              marginBottom: '12px',
              fontSize: '18px',
              fontWeight: '600'
            }}>
              {workoutData.workout_title}
            </h3>
            <p style={{ marginBottom: '16px' }}>{workoutData.message}</p>
            {workoutData.workout_schedule && (
              <div style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                padding: '12px'
              }}>
                {workoutData.workout_schedule.map((day, idx) => (
                  <div key={idx} style={{ marginBottom: '12px' }}>
                    <h4 style={{ 
                      color: 'inherit',
                      marginBottom: '8px',
                      fontSize: '16px',
                      fontWeight: '600'
                    }}>
                      {day.day}
                    </h4>
                    <p style={{ marginBottom: '8px' }}>{day.workout_description}</p>
                    {day.workout && (
                      <ul style={{ 
                        listStyle: 'none',
                        padding: '0',
                        margin: '0'
                      }}>
                        {day.workout.map((exercise, exIdx) => (
                          <li key={exIdx} style={{ 
                            marginBottom: '8px',
                            padding: '8px',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '4px'
                          }}>
                            <strong>{exercise.exercise_name}</strong>
                            <div style={{ fontSize: '14px', marginTop: '4px' }}>
                              {exercise.exercise_description}
                            </div>
                            <div style={{ 
                              fontSize: '14px',
                              marginTop: '4px',
                              color: 'inherit',
                              opacity: '0.9'
                            }}>
                              Sets: {exercise.exercise_sets} | Reps: {exercise.exercise_reps}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      }
    } catch (e) {
      // If not JSON or different format, return as is
      return content;
    }
    return content;
  };

  return (
    <div className="page-content">
      <div className="section">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 className="section-title" style={{ margin: 0 }}>AI Workout Assistant</h2>
          <div className="chat-mode-buttons-container">
            <button
              onClick={() => setChatType('general')}
              className={`chat-mode-btn ${chatType === 'general' ? 'active' : ''}`}
            >
              <span>General Chat</span>
            </button>
            <button
              onClick={() => setChatType('workout')}
              className={`chat-mode-btn ${chatType === 'workout' ? 'active' : ''}`}
            >
              <span>Create Workout</span>
            </button>
          </div>
        </div>
        
        <div className="card" style={{ 
          height: '600px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div className="chat-messages" style={{ 
            flex: 1,
            overflowY: 'auto',
            marginBottom: '20px',
            padding: '20px',
            backgroundColor: 'var(--background)',
            borderRadius: '8px'
          }}>
            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  marginBottom: '16px',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: message.sender === 'bot' ? 'var(--white)' : 'var(--primary-coral)',
                  color: message.sender === 'bot' ? 'var(--primary-brown)' : 'var(--white)',
                  maxWidth: '80%',
                  marginLeft: message.sender === 'bot' ? '0' : 'auto',
                  marginRight: message.sender === 'bot' ? 'auto' : '0',
                  boxShadow: '0 2px 4px rgba(70, 43, 37, 0.1)'
                }}
              >
                {message.sender === 'bot' ? formatWorkoutMessage(message.content) : message.content}
                {message.workout && (
                  <div style={{ marginTop: '12px' }}>
                    <button 
                      className="btn-secondary"
                      onClick={() => navigate('/workouts', { state: { workout: message.workout } })}
                      style={{ backgroundColor: 'var(--white)' }}
                    >
                      Save Workout
                    </button>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div style={{ color: 'var(--primary-coral)', textAlign: 'center' }}>
                Thinking...
              </div>
            )}
          </div>

          <form onSubmit={sendMessage} style={{ 
            display: 'flex',
            gap: '12px'
          }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={chatType === 'workout' ? "Describe your workout preferences..." : "Ask me anything about fitness..."}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '8px',
                border: '2px solid var(--primary-coral)',
                outline: 'none',
                fontSize: '16px'
              }}
            />
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isLoading}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
