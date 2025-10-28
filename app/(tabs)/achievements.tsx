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
import { certificates, courses } from "../model/dataType";

export default function Homepage() {
  const router = useRouter();
  const [certificatesList, setCertList] = useState<certificates[]>([]);
  const [courseList, setCourseList] = useState<courses[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeCert = onSnapshot(
      collection(db, "certificate"),
      (snapshot) => {
        const certData = snapshot.docs.map((doc) => ({
          cert_id: doc.id,
          ...doc.data(),
        })) as certificates[];

        setCertList(certData);
        setLoading(false);
      }
    );

    const unsubscribeCourse = onSnapshot(
      collection(db, "courses"),
      (snapshot) => {
        const courseData = snapshot.docs.map((doc) => ({
          course_id: doc.id,
          ...doc.data(),
        })) as courses[];

        setCourseList(courseData);
        setLoading(false);
      }
    );
    return () => {
      unsubscribeCert();
      unsubscribeCourse();
    };
  }, []);
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#d9efffff" }}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.headerTitle}>Learning & Achievements</Text>
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
        <Text style={styles.subheader}>Recommanded Certificate</Text>
        {certificatesList.map((item) => (
          <TouchableOpacity
            key={item.cert_id}
            style={styles.box}
            onPress={() =>
              router.push({
                pathname: "/certInformation",
                params: { id: item.cert_id },
              })
            }
          >
            <View style={styles.textContainer}>
              <Text style={styles.courseTitle}>{item.cert_name} </Text>
              <Text style={styles.courseProvider}>{item.company_name}</Text>
              <Text style={styles.achievementType}>{item.cert_type}</Text>
              <Text style={styles.rate}>
                ⭐ 4.8 {"("}
                {item.review}k{")"}
              </Text>
            </View>
            <Image
              source={require("../../assets/images/exploration.png")}
              style={styles.companyLogo}
            />
          </TouchableOpacity>
        ))}

        <Text style={styles.subheader}>Recommanded Courses</Text>
        {courseList.map((course) => (
          <TouchableOpacity
            key={course.course_id}
            style={styles.box}
            onPress={() =>
              router.push({
                pathname: "/learningInformation",
                params: { id: course.course_id },
              })
            }
          >
            <View style={styles.textContainer}>
              <Text style={styles.courseTitle}>{course.course_name} </Text>
              <Text style={styles.courseProvider}>{course.company_name}</Text>
              <Text style={styles.achievementType}>{course.course_type}</Text>
              <Text style={styles.rate}>
                ⭐ 4.8 {"("}
                {course.review}k{")"}
              </Text>
            </View>
            <Image
              source={require("../../assets/images/exploration.png")}
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
    color: "#8c92aaff",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 6,
  },

  subheader: {
    color: "#90a5f9ff",
    fontSize: 23,
    fontWeight: "700",
    marginBottom: 6,
    marginTop: 10,
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
});
