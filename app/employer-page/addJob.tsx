import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import React, { useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../../firebaseConfig";

export default function AddJob() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);

  const [job_name, setJobName] = useState("");
  const [job_salary, setJobSalary] = useState("");
  const [job_type, setJobType] = useState("");
  const [job_location, setJobLocation] = useState("");
  const [job_description, setJobDescription] = useState("");

  const handleAddJob = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        Alert.alert("Error", "User not logged in");
        return;
      }

      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        Alert.alert("Error", "User data not found");
        return;
      }

      const userData = userSnap.data();
      const job_company_id = userData.company_id;

      if (!job_company_id) {
        Alert.alert("Error", "Company ID not found for this user");
        return;
      }

      const companyRef = doc(db, "company", job_company_id);
      const companySnap = await getDoc(companyRef);

      if (!companySnap.exists()) {
        Alert.alert("Error", "Company document not found");
        return;
      }

      const companyData = companySnap.data();
      const company_name = companyData.company_name;

      const newJobRef = doc(collection(db, "job"));
      const jobData = {
        job_id: newJobRef.id,
        company_id: job_company_id,
        company_name: company_name,
        job_name,
        job_salary,
        job_type,
        job_location,
        job_description,
        createdAt: new Date(),
      };

      await setDoc(newJobRef, jobData);

      await updateDoc(companyRef, {
        jobs_id: arrayUnion(newJobRef.id),
      });

      Alert.alert("Success", "Job added successfully!");
      router.push("/(employerTabs)/home");
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#d9efffff" }}>
      <KeyboardAvoidingView style={{ flex: 1 }} keyboardVerticalOffset={80}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Add a Job Posting</Text>
            </View>

            <View style={styles.box}>
              <Text style={styles.label}>Job Name:</Text>
              <TextInput
                style={styles._textInput}
                placeholder="Enter job title"
                value={job_name}
                onChangeText={setJobName}
              />

              <Text style={styles.label}>Salary (RM):</Text>
              <TextInput
                style={styles._textInput}
                placeholder="Enter salary range"
                value={job_salary}
                onChangeText={setJobSalary}
                keyboardType="numeric"
              />

              <Text style={styles.label}>Job Type:</Text>
              <TextInput
                style={styles._textInput}
                placeholder="e.g. Full-time"
                value={job_type}
                onChangeText={setJobType}
              />

              <Text style={styles.label}>Location:</Text>
              <TextInput
                style={styles._textInput}
                placeholder="Enter location"
                value={job_location}
                onChangeText={setJobLocation}
              />

              <Text style={styles.label}>Job Description:</Text>
              <TextInput
                style={styles._textAreaInput}
                placeholder="Describe the job details..."
                value={job_description}
                onChangeText={setJobDescription}
                multiline={true}
                textAlignVertical="top"
              />

              <TouchableOpacity style={styles.btnNext} onPress={handleAddJob}>
                <Text style={styles.btnText}>Add Job</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  backBtn: {
    position: "absolute",
    top: 40,
    left: 20,
    padding: 8,
  },
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
  box: {
    width: "100%",
    padding: 20,
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
  boxTitle: {
    color: "#446cffff",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1B457C",
  },
  _textInput: {
    marginBottom: 8,
    marginTop: 10,
    height: 50,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#7b9ef6ff",
    fontSize: 16,
    paddingHorizontal: 10,
  },
  _textAreaInput: {
    marginBottom: 8,
    marginTop: 10,
    minHeight: 120,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#7b9ef6ff",
    fontSize: 16,
    paddingHorizontal: 10,
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
});
