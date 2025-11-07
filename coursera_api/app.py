from flask import Flask, jsonify
import requests
import firebase_admin
from firebase_admin import credentials, firestore

# --- Flask setup ---
app = Flask(__name__)

# --- Firebase setup ---
cred = credentials.Certificate("serviceAccountKey.json") 
firebase_admin.initialize_app(cred)
db = firestore.client()

@app.route("/scrape_courses")
def scrape_courses():
    api_url = "https://www.coursera.org/api/courses.v1?limit=20&fields=description,photoUrl,slug"
    response = requests.get(api_url)
    data = response.json()

    courses = []
    for item in data.get("elements", []):
        title = item.get("name")
        description = item.get("description", "No description available")
        image = item.get("photoUrl", "")
        link = f"https://www.coursera.org/learn/{item.get('slug')}"
        
        course = {
            "course_title": title,
            "course_link": link,
            "course_description": description,
            "course_image": image,
        }
        courses.append(course)

        # Upload to Firestore
        db.collection("courses").document(title).set(course)

    return jsonify({"message": "Courses uploaded successfully", "count": len(courses)})

# --- Run Flask server ---
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
