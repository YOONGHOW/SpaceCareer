import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { collection, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
import { courses } from "../model/dataType";

export default function Homepage() {
  const router = useRouter();
  const [courseList, setCourseList] = useState<courses[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "courses"), (snapshot) => {
      const coursesData = snapshot.docs.map((doc) => ({
        course_id: doc.id,
        ...doc.data(),
      })) as courses[];
      setCourseList(coursesData);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#7b9ef6ff" />
        <Text>Loading...</Text>
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
        <Text style={styles.headerTitle}>Learning & Achievements</Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#777"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="What do you want to learn"
            placeholderTextColor="#999"
          />
        </View>

        {/* Courses Section */}
        <Text style={styles.subheader}>
          Recommended Courses and Certificates
        </Text>
        {courseList.map((course) => (
          <TouchableOpacity
            key={course.course_id}
            style={styles.box}
            onPress={() =>
              router.push({
                pathname: "../job-seeker-page/learningInformation",
                params: {
                  id: course.course_id,
                  title: course.course_title,
                  description: course.course_description,
                  link: course.course_link,
                  image: course.course_image,
                },
              })
            }
          >
            <View style={styles.textContainer}>
              <Text style={styles.courseTitle}>{course.course_title}</Text>
              <Text style={styles.courseProvider}>Coursera</Text>
              <Text style={styles.achievementType}>Free Online Course</Text>
              <Text style={styles.rate}>⭐ 4.8</Text>
            </View>
            <Image
              source={
                course.course_image
                  ? { uri: course.course_image }
                  : require("../../assets/images/logo.png")
              }
              style={styles.companyLogo}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Keep your styles unchanged
const styles = StyleSheet.create({
  scrollContainer: {
    marginTop: 50,
    padding: 15,
    paddingBottom: 100,
  },
  headerTitle: {
    color: "#8c92aaff",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 6,
  },
  subheader: {
    color: "#90a5f9ff",
    fontSize: 19,
    fontWeight: "700",
    marginBottom: 6,
    marginTop: 10,
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
    elevation: 4,
    marginTop: 6,
  },
  companyLogo: {
    height: 65,
    width: 65,
    marginLeft: 20,
    borderRadius: 50,
  },
  textContainer: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1B457C",
    flexShrink: 1,
    flexWrap: "wrap",
  },
  courseProvider: {
    fontSize: 14,
    color: "#6b6b6b",
    marginTop: 2,
  },
  achievementType: {
    fontSize: 14,
    color: "#8b8b8b",
    marginTop: 1,
  },
  rate: {
    fontSize: 14,
    color: "#8b8b8b",
    marginTop: 1,
  },
});
