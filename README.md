# GainsGPT: Peronalized AI Workout Planner

## Overview

This tool allows a user to request a workout plan with constraints, such as how many days, injuries, equipment, age, etc., to the AI assistant and receive a personalized plan that follows the user's constraints. The user can then choose to save the workout if they like it.

The chat assistant has been configured to produce well-formatted and consistent workout plans so the users have an easy time viewing and following the workout plan.

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

## The Interface

### Home Page
![image](https://github.com/user-attachments/assets/f64329fc-479d-4642-965a-39e1f6affbad)

### Chat Bot Page
![image](https://github.com/user-attachments/assets/8128fc13-5998-4c95-9f15-ab84d3c9386b)

### Saved Workouts Page
![image](https://github.com/user-attachments/assets/355b98e0-83be-48ec-ac3b-2a3325eb738f)

### Workout Plan View
![image](https://github.com/user-attachments/assets/eae7e9ba-4518-4662-aa24-a7a1a4a66a1a)

## Workout Plan Generation In-Chat
![image](https://github.com/user-attachments/assets/b0d2285a-bace-4da1-8a65-e5e0a043f8e2)
![image](https://github.com/user-attachments/assets/3ec9ba7f-f45c-4d20-ad58-be384c445974)

