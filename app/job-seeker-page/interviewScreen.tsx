import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system/legacy";
import { useRouter } from "expo-router";
import * as Speech from "expo-speech";
import LottieView from "lottie-react-native";
import React, { useRef, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const QUESTIONS = [
  {
    id: 1,
    text: "Tell me about yourself.",
    keywords: ["university", "experience", "skills", "internship"],
  },
  {
    id: 2,
    text: "What are your strengths and weaknesses?",
    keywords: ["strength", "weakness", "improve", "good at"],
  },
  {
    id: 3,
    text: "Describe a challenge you faced and how you handled it.",
    keywords: ["challenge", "problem", "solution", "handled", "situation"],
  },
];

type Stage = "intro" | "question" | "result";

const BACKEND_BASE_URL =
  "http://172.20.10.6:5000"; /*ip address need to change during different wifi*/

const recordingOptions: Audio.RecordingOptions = {
  android: {
    extension: ".wav",
    outputFormat: Audio.AndroidOutputFormat.DEFAULT,
    audioEncoder: Audio.AndroidAudioEncoder.DEFAULT,
    sampleRate: 16000,
    numberOfChannels: 1,
    bitRate: 128000,
  },
  ios: {
    extension: ".wav",
    audioQuality: Audio.IOSAudioQuality.MAX,
    sampleRate: 16000,
    numberOfChannels: 1,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
    bitRate: 128000,
  },
  web: {
    mimeType: "audio/wav",
    bitsPerSecond: 128000,
  },
};

export default function MockInterviewScreen() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [allAnswers, setAllAnswers] = useState<string[]>([]);
  const [scores, setScores] = useState<{
    overall: number;
    communication: number;
    relevance: number;
    detail: number;
  } | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [micDisabled, setMicDisabled] = useState(false);

  const recordingRef = useRef<Audio.Recording | null>(null);

  const currentQuestion = QUESTIONS[currentIndex];

  const speak = (text: string) => {
    Speech.stop();
    Speech.speak(text, {
      language: "en-US",
      pitch: 1.0,
      rate: 1.0,
    });
  };

  const handleStart = () => {
    setStage("question");
    setCurrentIndex(0);
    setAllAnswers([]);
    setCurrentAnswer("");
    setScores(null);
    setVoiceError(null);
    setIsRecording(false);
    setIsTranscribing(false);
    speak("Hi, I am your interviewer. Let's start the mock interview.");
    setTimeout(() => speak(currentQuestion.text), 5250);
  };

  const saveAnswerAndGoNext = (answerOverride?: string) => {
    const answerToUse = (answerOverride ?? currentAnswer).trim();

    if (!answerToUse) {
      speak("Please say something for your answer.");
      return;
    }

    // Save this answer
    const updated = [...allAnswers];
    updated[currentIndex] = answerToUse;
    setAllAnswers(updated);
    setCurrentAnswer("");
    setVoiceError(null);

    const nextIndex = currentIndex + 1;

    if (nextIndex < QUESTIONS.length) {
      // Go to next question
      setCurrentIndex(nextIndex);
      speak("Okay, thank you. Next question.");
      setTimeout(() => speak(QUESTIONS[nextIndex].text), 1200);
    } else {
      // Finished all questions → calculate scores
      const result = calculateScores(updated);
      setScores(result);
      setStage("result");
      speak("Thank you. The interview is finished. Here is your score.");
    }
  };

  const handleNext = () => {
    if (isRecording) {
      stopRecordingAndTranscribe();
      return;
    }
    saveAnswerAndGoNext();
  };

  const handleReplayQuestion = () => {
    speak(currentQuestion.text);
  };

  const startRecording = async () => {
    try {
      setVoiceError(null);
      setCurrentAnswer("");

      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          "Permission Denied",
          "Microphone permission is required for voice input."
        );
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        recordingOptions,
        (status) => {
          // optional: handle status updates here
        },
        1000
      );

      recordingRef.current = recording;
      setIsRecording(true);
    } catch (e) {
      console.error("startRecording error:", e);
      setVoiceError("Failed to start recording.");
      setIsRecording(false);
    }
  };

  const stopRecordingAndTranscribe = async () => {
    try {
      const recording = recordingRef.current;
      if (!recording) return;

      setIsRecording(false);
      setIsTranscribing(true);

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      recordingRef.current = null;

      if (!uri) {
        setVoiceError("No audio URI found.");
        setIsTranscribing(false);
        return;
      }

      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const res = await fetch(`${BACKEND_BASE_URL}/speech_to_text`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audioContent: base64,
          config: { languageCode: "en-US" },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("STT backend error:", data);
        setVoiceError("Speech-to-text failed.");
      } else {
        const transcript =
          data.transcript ||
          (data.raw &&
            data.raw.results &&
            data.raw.results[0] &&
            data.raw.results[0].alternatives &&
            data.raw.results[0].alternatives[0].transcript) ||
          "";
        setCurrentAnswer(transcript);
        saveAnswerAndGoNext(transcript);
      }
    } catch (e) {
      console.error("stopRecordingAndTranscribe error:", e);
      setVoiceError("Failed to transcribe audio.");
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleMicPress = () => {
    if (micDisabled) return;
    setMicDisabled(true);
    setTimeout(() => {
      setMicDisabled(false);
    }, 1000);
    if (isRecording) {
      stopRecordingAndTranscribe();
    } else {
      startRecording();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => router.replace("/(job-seekerTabs)/learn")}
      >
        <Ionicons name="arrow-back" size={30} color="black" />
      </TouchableOpacity>

      <LottieView
        key={isRecording ? "hold" : "avatar"}
        source={
          isRecording
            ? require("../../assets/hold.json")
            : require("../../assets/avatar.json")
        }
        autoPlay
        loop
        style={{ width: 600, height: 600, marginTop: "-20%" }}
      />

      {stage === "intro" && (
        <View style={styles.card}>
          <Text style={styles.title}>Mrs Rachel Yeoh</Text>
          <Text style={styles.subtitle}>
            Your virtual HR avatar will ask you a few questions. Answer them as
            if this is a real interview.
          </Text>

          <TouchableOpacity style={styles.button} onPress={handleStart}>
            <Text style={styles.buttonText}>Start Interview</Text>
          </TouchableOpacity>
        </View>
      )}

      {stage === "question" && (
        <View style={styles.card}>
          <TouchableOpacity
            style={[styles.smallButton, { marginTop: 8 }]}
            onPress={handleReplayQuestion}
          >
            <Text style={styles.smallButtonText}>Hear Question Again</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.micButton,
              isRecording && styles.micButtonRecording,
              micDisabled && { opacity: 0.5 },
            ]}
            onPress={handleMicPress}
            disabled={isTranscribing || micDisabled}
          >
            <Ionicons
              name={isRecording ? "mic-off" : "mic"}
              size={32}
              color="white"
            />
          </TouchableOpacity>

          {voiceError && <Text style={styles.errorText}>{voiceError}</Text>}
        </View>
      )}

      {stage === "result" && scores && (
        <View style={styles.card}>
          <Text style={styles.title}>Your Interview Result</Text>
          <Text style={styles.overallScore}>
            Overall: {scores.overall.toFixed(1)} / 5.0
          </Text>

          <Text style={styles.scoreText}>
            Communication: {scores.communication.toFixed(1)} / 5
          </Text>
          <Text style={styles.scoreText}>
            Relevance: {scores.relevance.toFixed(1)} / 5
          </Text>
          <Text style={styles.scoreText}>
            Detail level: {scores.detail.toFixed(1)} / 5
          </Text>

          <Text style={styles.subtitle}>
            This is a simple Phase 1 scoring based on answer length and some
            keywords. Later you can replace it with real NLP / ML.
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/(job-seekerTabs)/learn")}
          >
            <Text style={styles.buttonText}>Finish</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

function calculateScores(answers: string[]) {
  const wordCounts = answers.map(
    (a) => a.split(/\s+/).filter((w) => w.length > 0).length
  );
  const totalWords = wordCounts.reduce((sum, n) => sum + n, 0);
  const avgWords = totalWords / (answers.length || 1);

  const communication = clamp((avgWords / 80) * 5, 1, 5);

  let keywordHits = 0;
  let possibleHits = 0;

  QUESTIONS.forEach((q, i) => {
    const ans = (answers[i] || "").toLowerCase();
    q.keywords.forEach((kw) => {
      possibleHits += 1;
      if (ans.includes(kw.toLowerCase())) {
        keywordHits += 1;
      }
    });
  });

  const relevance =
    possibleHits > 0 ? clamp((keywordHits / possibleHits) * 5, 1, 5) : 3;

  const detail = clamp((totalWords / 400) * 5, 1, 5);

  const overall = (communication + relevance + detail) / 3;

  return { overall, communication, relevance, detail };
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6fb",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  backBtn: {
    position: "absolute",
    top: 40,
    left: 20,
    padding: 8,
    zIndex: 10,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    padding: 16,
    marginTop: "-30%",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#555",
    marginVertical: 8,
  },
  button: {
    backgroundColor: "#4C6FFF",
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  smallButton: {
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: "#eef1ff",
  },
  smallButtonText: {
    fontSize: 12,
    color: "#4C6FFF",
  },
  overallScore: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginVertical: 4,
  },
  scoreText: {
    fontSize: 15,
    marginTop: 4,
    textAlign: "center",
  },
  micButton: {
    backgroundColor: "#4C6FFF",
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginVertical: 10,
    elevation: 3,
  },
  micButtonRecording: {
    backgroundColor: "#FF4C4C",
  },
  errorText: {
    fontSize: 12,
    color: "red",
    textAlign: "center",
    marginBottom: 8,
  },
});
