from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from pymongo import MongoClient
from bson import ObjectId
import json
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Connect to MongoDB Atlas (set your connection string in the MONGO_URI env variable)
MONGO_URI = os.environ.get("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client.get_database("workoutDB")
workouts_collection = db.get_collection("workouts")

# OpenAI API key (set your key in the OPENAI_API_KEY env variable)
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "message": "server is running!",
        "database_connected": db is not None and workouts_collection is not None
    })

@app.route('/test_connection', methods=['GET'])
def test_connection():
    try:
        client.admin.command('ping')
        return jsonify({"message": "Connection successful!"})
    except Exception as e:
        return jsonify({"message": f"Connection failed: {e}"})

@app.route('/debug/env', methods=['GET'])
def debug_env():
    """Debug endpoint to check environment variables"""
    return jsonify({
        "OPENAI_API_KEY_set": bool(os.environ.get('OPENAI_API_KEY')),
        "OPENAI_API_KEY_length": len(os.environ.get('OPENAI_API_KEY', '')),
        "MONGO_URI_set": bool(os.environ.get('MONGO_URI')),
        "all_env_vars": {k: f"{'*' * 8}{v[-4:] if v else ''}" 
                         for k, v in os.environ.items() if 'KEY' in k or 'URI' in k or 'SECRET' in k}
    })

@app.route('/debug/check_openai_key', methods=['GET'])
def debug_check_openai_key():
    openai_key = os.environ.get('OPENAI_API_KEY')
    if not openai_key:
        print("ERROR: OPENAI_API_KEY not found in environment variables")
        print("Available environment variables:", os.environ.keys())
        return jsonify({"error": "OpenAI API key not configured"}), 500
    return jsonify({"message": "OpenAI API key is configured"})

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    message = data.get("message", "")
    is_workout_request = data.get("isWorkoutRequest", False)

    # If it's a workout request, check if the message is workout-related.
    if is_workout_request:
        # Define keywords that indicate a workout-related query.
        keywords = ["workout", "exercise", "training", "gym"]
        if not any(keyword in message.lower() for keyword in keywords):
            # Return a message indicating the chat is for workouts only.
            return jsonify({
                "choices": [{
                    "message": {
                        "role": "assistant",
                        "content": "This chat is configured for creating workouts only. Please switch to general chat for other inquiries."
                    }
                }]
            })

        json_script = (
            '{"message":"Your intro response",'
            '"workout_title":"Title of the workout",'
            '"workout_schedule":[{"day":"Day of the week",'
            '"workout_description":"Workout Description",'
            '"workout":[{"exercise_name":"Exercise Name",'
            '"exercise_description":"Exercise Description",'
            '"exercise_sets":"type string",'
            '"exercise_reps":"type string"}]}]}'
        )
        full_message = f"{message}. Respond to my request, strictly in this json format: {json_script}"
    else:
        full_message = message

    # Check if OpenAI API key is missing and it's a workout request
    if not OPENAI_API_KEY and is_workout_request:
        sample_workout = {
            "message": "AI functionality is temporarily restricted. Here's a sample workout plan:",
            "workout_title": "Sample Full Body Workout",
            "workout_schedule": [
                {
                    "day": "Monday",
                    "workout_description": "Upper Body Strength",
                    "workout": [
                        {
                            "exercise_name": "Push-ups",
                            "exercise_description": "Standard push-ups",
                            "exercise_sets": "3",
                            "exercise_reps": "10-12"
                        },
                        {
                            "exercise_name": "Dumbbell Shoulder Press",
                            "exercise_description": "Seated or standing shoulder press",
                            "exercise_sets": "3",
                            "exercise_reps": "8-10"
                        }
                    ]
                },
                {
                    "day": "Wednesday",
                    "workout_description": "Lower Body & Core",
                    "workout": [
                        {
                            "exercise_name": "Bodyweight Squats",
                            "exercise_description": "Standard squats",
                            "exercise_sets": "3",
                            "exercise_reps": "12-15"
                        },
                        {
                            "exercise_name": "Plank",
                            "exercise_description": "Forearm plank",
                            "exercise_sets": "3",
                            "exercise_reps": "30-45 seconds"
                        }
                    ]
                }
            ]
        }
        return jsonify({
            "choices": [{
                "message": {
                    "role": "assistant",
                    "content": json.dumps(sample_workout)
                }
            }],
            "workout_data": sample_workout
        })

    # Call the OpenAI API if key is present
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {os.environ.get('OPENAI_API_KEY')}"
    }
    
    # Simple message structure without system message
    messages = [{"role": "user", "content": full_message}]
    
    payload = {
        "model": "gpt-3.5-turbo",
        "messages": messages,
        "temperature": 0.7,
        "max_tokens": 1000
    }
    
    try:
        response = requests.post(
            "https://api.openai.com/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=30  # 30 second timeout
        )
        response.raise_for_status()  # This will raise an HTTPError for bad responses (4xx, 5xx)
        openai_response = response.json()
        
    except requests.exceptions.RequestException as e:
        error_msg = f"Error calling OpenAI API: {str(e)}"
        print(error_msg)
        if hasattr(e, 'response') and e.response is not None:
            error_msg += f"\nResponse: {e.response.text}"
        return jsonify({"error": error_msg}), 500
    
    # Check if the response has the expected structure
    if not openai_response.get('choices') or not openai_response['choices']:
        return jsonify({"error": "Unexpected response format from OpenAI"}), 500

    # If it's a workout request, attempt to parse the JSON response
    if is_workout_request:
        try:
            workout_data = json.loads(openai_response["choices"][0]["message"]["content"])
            openai_response["workout_data"] = workout_data
        except Exception as e:
            print("Error parsing workout JSON:", e)
            openai_response["workout_data"] = None

    return jsonify(openai_response)

@app.route('/workouts', methods=['GET'])
def get_workouts():
    workouts = list(workouts_collection.find())
    for workout in workouts:
        workout['_id'] = str(workout['_id'])
    return jsonify(workouts)

@app.route('/workouts', methods=['POST'])
def add_workout():
    workout_data = request.json
    result = workouts_collection.insert_one(workout_data)
    workout_data['_id'] = str(result.inserted_id)
    return jsonify(workout_data), 201

@app.route('/workouts/<workout_id>', methods=['GET'])
def get_workout(workout_id):
    workout = workouts_collection.find_one({"_id": ObjectId(workout_id)})
    if workout:
        workout['_id'] = str(workout['_id'])
        return jsonify(workout)
    return jsonify({"error": "Workout not found"}), 404

@app.route('/health')
def health_check():
    """Health check endpoint to verify database connectivity"""
    try:
        if db is None or workouts_collection is None:
            return jsonify({"status": "error", "message": "Database not connected"}), 500
        
        # Test the database connection
        db.command('ping')
        return jsonify({
            "status": "success",
            "database": "connected",
            "collections": {
                "workouts": workouts_collection.name
            }
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True)
