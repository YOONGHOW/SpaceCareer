import { useRouter } from "expo-router";
import { collection, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../firebaseConfig";
import { jobApplied, jobs } from "../model/dataType";

export default function JobStatus() {
  const router = useRouter();
  const [jobAppliedList, setJobAppliedList] = useState<jobApplied[]>([]);

  useEffect(() => {
    const unsubJobApplied = onSnapshot(
      collection(db, "jobApplied"),
      (snapshot) => {
        const appliedData = snapshot.docs.map((doc) => ({
          jobApplied_id: doc.id,
          ...doc.data(),
        })) as jobApplied[];

        const unsubJobs = onSnapshot(collection(db, "job"), (jobSnap) => {
          const jobMap = new Map<string, jobs>();
          jobSnap.docs.forEach((doc) => jobMap.set(doc.id, doc.data() as jobs));

          const merged = appliedData.map((applied) => ({
            ...applied,
            jobDetails: jobMap.get(applied.jobId),
          }));

          setJobAppliedList(merged);
        });
      }
    );
    return () => {
      unsubJobApplied();
    };
  }, []);

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#d9efffff" }}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.headerTitle}>My Applications</Text>

        {jobAppliedList.map((applied) => (
          <TouchableOpacity
            key={applied.jobApplied_id}
            style={styles.box}
            onPress={() =>
              router.push({
                pathname: "/jobReview",
                params: { id: applied.jobDetails?.job_id },
              })
            }
          >
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.companyLogo}
            />
            <View style={styles.textContainer}>
              <Text style={styles.jobTitle}>
                {applied.jobDetails?.job_name}
              </Text>
              <Text style={styles.companyName}>
                {applied.jobDetails?.company_name}
              </Text>
              <Text style={styles.jobType}>{applied.jobDetails?.job_type}</Text>
              <Text style={styles.location}>
                {applied.jobDetails?.job_location}
              </Text>
              <Text style={styles.salary}>
                RM{applied.jobDetails?.job_salary}
              </Text>
              <Text style={styles.status}>
                Status:{" "}
                <Text style={styles.statusChange}>{applied.jobStatus}</Text>
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    marginTop: 50,
    padding: 10,
    paddingBottom: 100,
  },

  headerTitle: {
    color: "#8c92aaff",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 6,
  },

  box: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
    marginTop: 12,
  },

  companyLogo: {
    height: 80,
    width: 80,
    marginRight: 20,
    borderRadius: 5,
  },

  textContainer: {
    flex: 1,
  },

  jobTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1B457C",
  },

  companyName: {
    fontSize: 18,
    color: "#6b6b6b",
    marginTop: 4,
  },

  jobType: {
    fontSize: 15,
    color: "#8b8b8b",
    marginTop: 2,
  },

  location: {
    fontSize: 15,
    color: "#8b8b8b",
    marginTop: 2,
  },

  salary: {
    fontSize: 15,
    color: "#8b8b8b",
    marginTop: 2,
  },

  status: {
    fontSize: 16,
    color: "#81a2faff",
    marginTop: 15,
    fontWeight: "bold",
  },

  statusChange: {
    fontSize: 15,
    color: "#abb8ffff",
    fontWeight: "bold",
  },
});
