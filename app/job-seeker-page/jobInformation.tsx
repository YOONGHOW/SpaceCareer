import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../../firebaseConfig";
import { jobs } from "../model/dataType";

export default function Homepage() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [job, setJob] = useState<jobs | null>(null);
  const [loading, setLoading] = useState(true);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const docRef = doc(db, "job", id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setJob({ job_id: docSnap.id, ...docSnap.data() } as jobs);
        }
      } catch (error) {
        console.error("Error fetching job:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchJob();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (!job) {
    return (
      <View style={styles.center}>
        <Text>Job not found</Text>
      </View>
    );
  }

  {
    /*Store register cert*/
  }
  const user = auth.currentUser;

  if (!user) {
    return;
  }

  const handleJobApplied = async () => {
    try {
      const appliedJobStatus = "Received";
      const user = auth.currentUser;

      if (!user) {
        Alert.alert("Error", "User not logged in");
        return;
      }

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        Alert.alert("Error", "User data not found");
        return;
      }
      const userData = userSnap.data() || {};
      const appliedList = (userData.jobApplied_id || []) as string[];
      const alreadyApplied = appliedList.includes(job.job_id);

      if (alreadyApplied) {
        setAlreadyApplied(true);
        return;
      }

      const jobAppliedID = "job_" + Date.now();

      const newDocRef = doc(db, "jobApplied", jobAppliedID);
      const data = {
        jobApplied_id: jobAppliedID,
        userId: user.uid,
        jobId: job.job_id,
        jobStatus: appliedJobStatus,
        createdAt: new Date(),
      };

      await setDoc(newDocRef, data);

      await updateDoc(userRef, {
        jobApplied_id: arrayUnion(job.job_id),
      });

      Alert.alert("Success", "Job Applied Successfully!");
      router.push("/job-status");
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#d9efffff" }}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.box}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.companyLogo}
            />
            <Text style={styles.jobTitle}>{job.job_name}</Text>
            <Text style={styles.companyName}>{job.company_name}</Text>
          </View>
          <View
            style={{
              height: 2,
              backgroundColor: "#ccc",
              width: "100%",
              marginVertical: 12,
            }}
          />
          <View style={styles.textContainer}>
            <Text style={styles.location}>
              <Ionicons name="location" size={21} color="black" />
              {"  "}
              {job.job_location}
            </Text>
            <Text style={styles.jobType}>
              <Ionicons name="time" size={21} color="black" />
              {"  "}
              {job.job_type}
            </Text>
            <Text style={styles.salary}>
              <FontAwesome name="money" size={19} color="black" />
              {"  "}
              RM{job.job_salary}
            </Text>
            <View
              style={{
                height: 2,
                backgroundColor: "#ccc",
                width: "100%",
                marginVertical: 12,
              }}
            />
            <Text style={styles.subheading}>Job Responsibilities:</Text>
            <Text style={styles.job_descrip}>{job.job_description}</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.applyButton,
              alreadyApplied ? styles.disabledButton : styles.applyButton,
            ]}
            onPress={handleJobApplied}
            disabled={alreadyApplied}
          >
            <Text style={styles.btnText}>
              {alreadyApplied ? "Already Applied" : "Quick Apply"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  backBtn: {
    position: "absolute",
    top: 40,
    left: 20,
    padding: 8,
  },
  scrollContainer: {
    marginTop: 50,
    padding: 10,
    paddingBottom: 100,
  },

  box: {
    width: "100%",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
  companyLogo: {
    height: 100,
    width: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#d0d0d0ff",
    marginTop: 40,
  },

  titleContainer: {
    alignItems: "center",
    flex: 1,
  },

  textContainer: {
    flex: 1,
  },
  subheading: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1B457C",
  },

  jobTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1B457C",
    marginTop: 10,
  },
  companyName: {
    fontSize: 18,
    color: "#6b6b6b",
    marginTop: 4,
  },
  jobType: {
    fontSize: 15,
    color: "#8b8b8b",
    marginTop: 12,
  },

  job_descrip: {
    fontSize: 15,
    color: "#8b8b8b",
    marginTop: 12,
    textAlign: "justify",
  },
  location: {
    fontSize: 15,
    color: "#8b8b8b",
  },
  salary: {
    fontSize: 15,
    color: "#8b8b8b",
    marginTop: 12,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  applyButton: {
    padding: 7,
    borderWidth: 2,
    borderColor: "#7b9ef6ff",
    borderRadius: 25,
    width: "60%",
    alignSelf: "center",
    marginTop: 30,
    backgroundColor: "#e7eeffff",
  },

  disabledButton: {
    backgroundColor: "#389bfdff",
  },

  btnText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: "#1B457C",
  },
});
