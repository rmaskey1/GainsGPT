from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from pymongo import MongoClient
from bson import ObjectId
import json

app = Flask(__name__)
CORS(app)

# Connect to MongoDB Atlas (set your connection string in the MONGO_URI env variable)
MONGO_URI = os.environ.get("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client.get_database("workoutDB")
workouts_collection = db.get_collection("workouts")

# OpenAI API key (set your key in the OPENAI_API_KEY env variable)
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

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

    # Call the OpenAI API
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {os.environ.get('OPENAI_API_KEY', 'your_openai_api_key')}"
    }
    payload = {
        "model": "gpt-3.5-turbo",
        "messages": [
            {"role": "user", "content": full_message}
        ]
    }
    response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)
    if response.status_code != 200:
        return jsonify({"error": "Failed to get response from OpenAI"}), response.status_code

    openai_response = response.json()

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

if __name__ == '__main__':
    app.run()
