from flask import Flask, jsonify, request
import os

import base64, io
from pydub import AudioSegment
import requests
import firebase_admin
from firebase_admin import credentials, firestore
from flask_cors import CORS
os.environ["PATH"] += os.pathsep + r"C:\ffmpeg_tools"

AudioSegment.converter = r"C:\ffmpeg_tools\ffmpeg.exe"
AudioSegment.ffprobe = r"C:\ffmpeg_tools\ffprobe.exe"

# --- Flask setup ---
app = Flask(__name__)
CORS(app)

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
        db.collection("courses").document(title).set(course)
    return jsonify({"message": "Courses uploaded successfully", "count": len(courses)})

@app.route("/speech_to_text", methods=["POST"])
def speech_to_text():
    google_api_key = os.environ.get("GOOGLE_SPEECH_API_KEY")
    if not google_api_key:
        return jsonify({"error": "GOOGLE_SPEECH_API_KEY not set"}), 500

    data = request.get_json() or {}
    audio_content = data.get("audioContent")
    config = data.get("config", {})

    if not audio_content:
        return jsonify({"error": "audioContent (base64) is required"}), 400

    try:
        # 🔁 Convert whatever came from phone into LINEAR16 WAV
        raw_bytes = base64.b64decode(audio_content)
        audio = AudioSegment.from_file(io.BytesIO(raw_bytes))
        buf = io.BytesIO()
        audio.export(buf, format="wav", parameters=["-acodec", "pcm_s16le"])
        pcm_base64 = base64.b64encode(buf.getvalue()).decode("utf-8")

        stt_config = {
             "encoding": "LINEAR16",
             "languageCode": config.get("languageCode", "en-US"),
            "enableAutomaticPunctuation": True,
        }

        body = {"config": stt_config, "audio": {"content": pcm_base64}}

        url = f"https://speech.googleapis.com/v1/speech:recognize?key={google_api_key}"
        resp = requests.post(url, json=body)
        resp_json = resp.json()
        print("Google STT raw response:", resp_json)

        if "error" in resp_json:
            print("Google STT error:", resp_json["error"])
            return jsonify({"error": resp_json["error"]}), 500

        results = resp_json.get("results", [])
        transcript = ""
        if results and "alternatives" in results[0]:
            transcript = results[0]["alternatives"][0].get("transcript", "")

        return jsonify({"transcript": transcript, "raw": resp_json})

    except Exception as e:
        print("Error converting or calling Google STT:", e)
        return jsonify({"error": "Internal STT error"}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)