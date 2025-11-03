import { useRouter } from "expo-router";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
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
  const [jobList, setJobList] = useState<jobs[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndJobs = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          Alert.alert("Error", "User not logged in");
          return;
        }
        setUserId(user.uid);

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          Alert.alert("Error", "User data not found");
          return;
        }

        const userData = userSnap.data();
        const userCompanyId = userData?.company_id;

        if (!userCompanyId) {
          Alert.alert("Error", "Company ID not found for user");
          return;
        }

        const q = query(
          collection(db, "job"),
          where("company_id", "==", userCompanyId)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const jobData = snapshot.docs.map((doc) => ({
            job_id: doc.id,
            ...doc.data(),
          })) as jobs[];

          setJobList(jobData);
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error loading jobs:", error);
        Alert.alert("Error", "Failed to load jobs");
      }
    };

    fetchUserAndJobs();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ fontSize: 18 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#d9efffff" }}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.headerTitle}>My Company Jobs</Text>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() =>
            router.push({
              pathname: "../employer-page/addJob",
              params: { userId: userId ?? "" },
            })
          }
        >
          <Text style={styles.addBtnText}>+ Add New Job</Text>
        </TouchableOpacity>

        {jobList.length === 0 ? (
          <Text style={styles.emptyText}>
            No jobs found for your company yet.
          </Text>
        ) : (
          jobList.map((item) => (
            <TouchableOpacity
              key={item.job_id}
              style={styles.box}
              onPress={() =>
                router.push({
                  pathname: "/employer-page/jobInformation",
                  params: { id: item.job_id },
                })
              }
            >
              <Image
                source={require("../../assets/images/logo.png")}
                style={styles.companyLogo}
              />
              <View style={styles.textContainer}>
                <Text style={styles.jobTitle}>{item.job_name}</Text>
                <Text style={styles.companyName}>{item.company_name}</Text>
                <Text style={styles.jobType}>{item.job_type}</Text>
                <Text style={styles.location}>{item.job_location}</Text>
                <Text style={styles.salary}>RM{item.job_salary}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
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
  addBtn: {
    padding: 10,
    borderWidth: 2,
    borderColor: "#7b9ef6ff",
    borderRadius: 30,
    width: "75%",
    alignSelf: "center",
    marginTop: 25,
    backgroundColor: "#e7eeffff",
  },
  addBtnText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: "#1B457C",
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
    height: 65,
    width: 65,
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
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 30,
    color: "#777",
  },
});
