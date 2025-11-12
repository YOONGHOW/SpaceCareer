import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { collection, onSnapshot } from "firebase/firestore";
import LottieView from "lottie-react-native";
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
        <View style={styles.animationbox}>
          <LottieView
            source={require("../../assets/education.json")}
            autoPlay
            loop
            style={{ width: 125, height: 125 }}
          />
          <Text style={styles.headerTitle}>Achievements</Text>
        </View>
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
        <Text style={styles.subheader}>Recommended Courses & Certificates</Text>

        <Text style={styles.emptyText}>
          ** Please complete your profile firsts **
        </Text>
        <Text style={styles.subheader}>Other courses & certificates</Text>
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

const styles = StyleSheet.create({
  scrollContainer: {
    marginTop: 50,
    padding: 15,
    paddingBottom: 100,
  },
  headerTitle: {
    color: "#7a7f92ff",
    fontSize: 23,
    fontWeight: "700",
    marginLeft: 15,
  },
  subheader: {
    color: "#90a5f9ff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    marginTop: 10,
  },
  emptyText: {
    textAlign: "center",
    color: "#888",
    marginTop: 10,
    fontSize: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#aec5ffff",
    paddingHorizontal: 12,
    marginTop: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
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

  animationbox: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderRadius: 10,
    backgroundColor: "#e6f1ffff",
    marginBottom: "2%",
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
