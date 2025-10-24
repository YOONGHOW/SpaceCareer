import React, { useState } from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { auth, db } from "../firebaseConfig";
import { doc, setDoc, collection, updateDoc } from "firebase/firestore";

export default function EducationSetup() {
  const router = useRouter();
  const user = auth.currentUser;
  const [_university, setUniversity] = useState("");
  const [_educationLevel, setEducationLevel] = useState("");
  const [_fieldOfStudy, setFieldOfStudy] = useState("");
  const [_academicResult, setAcademicResult] = useState("");

  if (!user) {
    return;
  }

  const handleAddEducation = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Error", "User not logged in");
        return;
      }

      const newDocRef = doc(collection(db, "education"));

      const data = {
        id: newDocRef.id,
        userId: user.uid,
        _university,
        _educationLevel,
        _fieldOfStudy,
        _academicResult,
        createdAt: new Date(),
      };

      await setDoc(newDocRef, data);

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        educationId: newDocRef.id,
      });

      Alert.alert("Success", "Education added successfully!");
      router.push("/careerProfile");
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#d9efffff" }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Let’s Get to Know You</Text>
        </View>

        {/* Content Box */}
        <View style={styles.box}>
          <Text style={styles.boxTitle}>Education</Text>

          <Text style={styles.label}>University:</Text>

          {/* Input Field */}
          <View style={{ position: "relative" }}>
            <TextInput
              style={styles._textInput}
              placeholder="Enter your university name"
              value={_university}
              onChangeText={(text) => {
                setUniversity(text);
              }}
            />
          </View>

          <Text style={styles.label}>Education Level:</Text>

          {/* Input Field */}
          <View style={{ position: "relative" }}>
            <TextInput
              style={styles._textInput}
              placeholder="Enter your education level"
              value={_educationLevel}
              onChangeText={(text) => {
                setEducationLevel(text);
              }}
            />
          </View>

          <Text style={styles.label}>Field of study:</Text>

          {/* Input Field */}
          <View style={{ position: "relative" }}>
            <TextInput
              style={styles._textInput}
              placeholder="Enter your field of study"
              value={_fieldOfStudy}
              onChangeText={(text) => {
                setFieldOfStudy(text);
              }}
            />
          </View>
          <Text style={styles.label}>Academic Result:</Text>
          <View style={{ position: "relative" }}>
            <TextInput
              style={styles._textInput}
              placeholder="Enter your academic result"
              value={_academicResult}
              onChangeText={(text) => {
                setAcademicResult(text);
              }}
            />
          </View>

          {/* Button */}
          <TouchableOpacity style={styles.btnNext} onPress={handleAddEducation}>
            <Text style={styles.btnText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
  },
  header: {
    marginVertical: 30,
    marginTop: 50,
  },
  headerTitle: {
    color: "#8BA0FF",
    fontSize: 25,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 6,
  },

  boxTitle: {
    color: "#446cffff",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 6,
    paddingBottom: 10,
  },

  box: {
    width: "100%",
    height: "75%",
    padding: 20,
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
    marginTop: -10,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1B457C",
  },
  backBtn: {
    position: "absolute",
    top: 40,
    left: 20,
    padding: 8,
  },
  btnNext: {
    padding: 10,
    borderWidth: 2,
    borderColor: "#7b9ef6ff",
    borderRadius: 30,
    width: "75%",
    alignSelf: "center",
    marginTop: 25,
    backgroundColor: "#e7eeffff",
  },
  btnText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: "#1B457C",
  },
  _textInput: {
    marginBottom: 8,
    marginTop: 10,
    height: 48,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#7b9ef6ff",
    fontSize: 14,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  suggestionBox: {
    position: "absolute",
    top: 55,
    width: "100%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    zIndex: 10,
    maxHeight: 120,
    elevation: 6,
  },
  suggestion: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});
