import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { collection, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../firebaseConfig";
import { jobs } from "../model/dataType";

export default function Homepage() {
  const router = useRouter();
  const [jobList, setJobList] = useState<jobs[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "job"), (snapshot) => {
      const jobData = snapshot.docs.map((doc) => ({
        job_id: doc.id,
        ...doc.data(),
      })) as jobs[];

      setJobList(jobData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#d9efffff" }}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.headerTitle}>Recommended Careers</Text>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#777"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Career search"
            placeholderTextColor="#999"
          />
        </View>

        {jobList.map((item) => (
          <TouchableOpacity
            key={item.job_id}
            style={styles.box}
            onPress={() =>
              router.push({
                pathname: "/jobInformation",
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
  _textInput: {
    width: "100%",
    marginBottom: 8,
    marginTop: 10,
    padding: 15,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#7b9ef6ff",
    fontSize: 16,
    backgroundColor: "#ffffffff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#7b9ef6ff",
    paddingHorizontal: 12,
    height: 50,
    marginTop: 10,
    marginBottom: 5,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
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
});
