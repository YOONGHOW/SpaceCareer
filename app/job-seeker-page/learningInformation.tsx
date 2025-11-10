import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
import { courses } from "../model/dataType";

export default function LearningInformation() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [course, setCourse] = useState<courses | null>(null);
  const [loading, setLoading] = useState(true);
  const [alreadyRegister, setAlreadyRegister] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const docRef = doc(db, "courses", id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCourse({ course_id: docSnap.id, ...docSnap.data() } as courses);
        }
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCourse();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (!course) {
    return (
      <View style={styles.center}>
        <Text>Course not found.</Text>
      </View>
    );
  }

  const handleRegisterCourse = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Error", "User not logged in");
        return;
      }

      const courseRegisterID = "course_" + Date.now();
      const newDocRef = doc(db, "courseRegisted", courseRegisterID);

      const data = {
        courseRegister_id: courseRegisterID,
        userId: user.uid,
        course_id: course.course_id,
        courseTitle: course.course_title || "",
        courseLink: course.course_link || "",
        courseStatus: "Registed",
        createdAt: new Date(),
      };

      await setDoc(newDocRef, data);

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        Alert.alert("Error", "User data not found");
        return;
      }
      const userData = userSnap.data() || {};
      const alreadRegister = (userData.courseRegister_id || []) as string[];

      if (alreadRegister) {
        setAlreadyRegister(true);
        return;
      }
      await updateDoc(userRef, {
        courseRegister_id: courseRegisterID,
      });

      Alert.alert("Success", "Course registered successfully!");
      router.push("/learn");
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", error.message);
    }
  };

  const handleOpenCourseLink = () => {
    if (course.course_link) {
      Linking.openURL(course.course_link);
    } else {
      Alert.alert("No link found");
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#d9efff" }}>
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
              source={
                course.course_image
                  ? { uri: course.course_image }
                  : require("../../assets/images/logo.png")
              }
              style={styles.companyLogo}
            />
            <Text style={styles.courseTitle}>{course.course_title}</Text>
            <Text style={styles.companyName}>
              {course.company_name || "Coursera"}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.textContainer}>
            <Text style={styles.certType}>
              <Ionicons name="book" size={21} color="black" />
              {"  "}
              {"Free Online Course"}
            </Text>

            <View style={styles.divider} />

            <Text style={styles.subheading}>Course Description:</Text>
            <Text style={styles.cert_description}>
              {course.course_description || "No description available."}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.btnApply,
              alreadyRegister ? styles.disabledButton : styles.btnApply,
            ]}
            onPress={handleRegisterCourse}
            disabled={alreadyRegister}
          >
            <Text style={styles.btnText}>
              {alreadyRegister ? "Already Registed" : "Register"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnLearn}
            onPress={handleOpenCourseLink}
          >
            <Text style={styles.btnText}>Go to Course</Text>
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
    borderColor: "#d0d0d0",
    marginTop: 40,
  },

  disabledButton: {
    backgroundColor: "#bbddffff",
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
  courseTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1B457C",
    marginTop: 10,
    textAlign: "center",
  },
  companyName: {
    fontSize: 18,
    color: "#6b6b6b",
    marginTop: 4,
  },
  certType: {
    fontSize: 15,
    color: "#8b8b8b",
  },
  cert_description: {
    fontSize: 15,
    color: "#8b8b8b",
    marginTop: 12,
    textAlign: "justify",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  btnApply: {
    padding: 10,
    borderRadius: 25,
    width: "70%",
    alignSelf: "center",
    marginTop: 20,
    backgroundColor: "#7b9ef6",
  },
  btnLearn: {
    padding: 10,
    borderRadius: 25,
    width: "70%",
    alignSelf: "center",
    marginTop: 15,
    backgroundColor: "#53b4adff",
  },
  btnText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  divider: {
    height: 2,
    backgroundColor: "#ccc",
    width: "100%",
    marginVertical: 12,
  },
});
