# GainsGPT: Peronalized AI Workout Planner

## Overview

This tool allows a user to request a workout plan with constraints, such as how many days, injuries, equipment, age, etc., to the AI assistant and receive a personalized plan that follows the user's constraints. The user can then choose to save the workout if they like it.

## Setup

### Dependencies

**Backend**
- Python 3.11+
- Flask 3.0.3
- Requests 2.32.3
- Pymongo 4.11.2
- Flask CORS 5.0.1

Install Python libraries:
```bash
pip install flask flask-cors requests pymongo
```

**Frontend**
- Node 20+

Install all frontend dependencies:
```bash
npm install
```

### Environment Setup

In the main folder, create a .env folder in which you must include the following:

```
OPENAI_API_KEY=[your-openai-api-key]
MONGO_USERNAME=[your-mongo-database-username]
MONGO_PASSWORD=[your-mongo-database-password]
MONGO_URI=[your-mongo-database-uri]
```

## Running the Application

### Starting Flask Server

In the terminal, run the following:
```bash
cd backend
python server.py
```

### Starting React App

In a separate terminal window, run the following:
```bash
cd frontend
npm run start
```

### Accessing the Webapp

The webapp will run on http://localhost:3000/, where you can interact with the application however you'd like
