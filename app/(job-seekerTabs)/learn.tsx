import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { collection, doc, getDocs, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../../firebaseConfig";
import { courseRegister, courses } from "../model/dataType";

export default function LearningPage() {
  const router = useRouter();
  const [courseRegisterList, setCourseRegisterList] = useState<
    courseRegister[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "users", user.uid);

    const unsubscribeUser = onSnapshot(userRef, async (userSnap) => {
      if (!userSnap.exists()) {
        setCourseRegisterList([]);
        setLoading(false);
        return;
      }

      const userData = userSnap.data();
      const courseIds = userData.courseRegister_id || [];

      const courseSnap = await getDocs(collection(db, "courses"));
      const courseMap = new Map<string, courses>();
      courseSnap.forEach((doc) => courseMap.set(doc.id, doc.data() as courses));

      const courseRegSnap = await getDocs(collection(db, "courseRegisted"));
      const courseRegs = courseRegSnap.docs
        .filter((doc) => courseIds.includes(doc.id))
        .map((doc) => ({
          courseRegister_id: doc.id,
          ...doc.data(),
          courseDetails: courseMap.get((doc.data() as any).course_id),
        })) as courseRegister[];

      setCourseRegisterList(courseRegs);
      setLoading(false);
    });

    return () => unsubscribeUser();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#7b9ef6ff" />
        <Text>Loading your learning data...</Text>
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
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Learning Overview</Text>
        </View>

        <View style={styles.box}>
          <Image
            source={require("../../assets/images/robot.png")}
            style={styles.robotImg}
          />
          <TouchableOpacity
            style={styles.btnNext}
            onPress={() => router.push("/job-seeker-page/interviewScreen")}
          >
            <Ionicons
              name="call"
              size={20}
              color="#a0a0feff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.btnText}>Start Mock Interview</Text>
          </TouchableOpacity>
        </View>

        {/* Courses Section */}
        <Text style={styles.subheader}>Registed Courses and Certificate</Text>
        {courseRegisterList.length === 0 ? (
          <Text style={styles.emptyText}>No registed courses found.</Text>
        ) : (
          courseRegisterList.map((course) => (
            <TouchableOpacity
              key={course.courseRegister_id}
              style={styles.course_box}
              onPress={() =>
                Linking.openURL(course.courseDetails?.course_link || "")
              }
            >
              <View style={styles.textContainer}>
                <Text style={styles.courseTitle}>
                  {course.courseDetails?.course_title}
                </Text>
                <Text style={styles.courseProvider}>Coursera </Text>
                <Text style={styles.achievementType}>Online Free Course</Text>
                <Text style={styles.rate}>
                  ⭐ 4.8 {"("}
                  {100}
                  {")"}
                </Text>
                <Text style={styles.status}>
                  Status:{" "}
                  <Text style={styles.statusChange}>{course.courseStatus}</Text>
                </Text>
              </View>
              <Image
                source={{ uri: course.courseDetails?.course_image }}
                style={styles.companyLogo}
              />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    marginVertical: 30,
    marginTop: 50,
  },
  headerTitle: {
    color: "#8c92aaff",
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
    marginTop: -10,
  },
  robotImg: {
    height: 80,
    width: 80,
    alignSelf: "center",
    marginBottom: 25,
    borderRadius: 50,
    backgroundColor: "#dae4fdff",
  },
  btnNext: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e7eeffff",
    paddingVertical: 12,
    borderRadius: 30,
    borderColor: "#a3bcfdff",
    borderWidth: 1,
  },
  btnText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    color: "#1B457C",
  },
  scrollContainer: {
    padding: 15,
    paddingBottom: 100,
  },
  subheader: {
    color: "#90a5f9ff",
    fontSize: 19,
    fontWeight: "700",
    marginBottom: 6,
    marginTop: 10,
  },
  course_box: {
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
    borderRadius: 5,
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
  status: {
    fontSize: 16,
    color: "#909192ff",
    marginTop: 15,
    fontWeight: "bold",
  },
  statusChange: {
    fontSize: 15,
    color: "#5c8d66ff",
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    color: "#888",
    marginTop: 10,
    fontSize: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
