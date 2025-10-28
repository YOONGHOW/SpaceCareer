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
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../firebaseConfig";
import {
  certificates,
  certRegister,
  courseRegister,
  courses,
} from "../model/dataType";

export default function LearningPage() {
  const router = useRouter();
  const [courseRegisterList, setCourseRegisterList] = useState<
    courseRegister[]
  >([]);
  const [certRegisterList, setCertRegisterList] = useState<certRegister[]>([]);

  useEffect(() => {
    //Course Register Display

    const unsubCourseApplied = onSnapshot(
      collection(db, "courseRegisted"),
      (snapshot) => {
        const appliedData = snapshot.docs.map((doc) => ({
          courseRegister_id: doc.id,
          ...doc.data(),
        })) as courseRegister[];

        const unsubCourse = onSnapshot(collection(db, "courses"), (jobSnap) => {
          const jobMap = new Map<string, courses>();
          jobSnap.docs.forEach((doc) =>
            jobMap.set(doc.id, doc.data() as courses)
          );

          const merged = appliedData.map((course) => ({
            ...course,
            courseDetails: jobMap.get(course.course_id),
          }));

          setCourseRegisterList(merged);
        });
      }
    );

    //Certificate Register Display

    const unsubCertApplied = onSnapshot(
      collection(db, "certRegisted"),
      (snapshot) => {
        const appliedData = snapshot.docs.map((doc) => ({
          certRegisted_id: doc.id,
          ...doc.data(),
        })) as certRegister[];

        const unsubCert = onSnapshot(
          collection(db, "certificate"),
          (certSnap) => {
            const certMap = new Map<string, certificates>();
            certSnap.docs.forEach((doc) =>
              certMap.set(doc.id, doc.data() as certificates)
            );

            const merged = appliedData.map((cert) => ({
              ...cert,
              certDetails: certMap.get(cert.certId),
            }));

            setCertRegisterList(merged);
          }
        );
      }
    );

    return () => {
      unsubCourseApplied();
      unsubCertApplied();
    };
  }, []);
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
          {/* Button */}
          <TouchableOpacity
            style={styles.btnNext}
            onPress={() => router.push("/(tabs)/home")}
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

        <Text style={styles.subheader}>Registered Courses</Text>
        {courseRegisterList.map((course) => (
          <TouchableOpacity
            key={course.courseRegister_id}
            style={styles.course_box}
          >
            <View style={styles.textContainer}>
              <Text style={styles.courseTitle}>
                {course.courseDetails?.course_name}
              </Text>
              <Text style={styles.courseProvider}>
                {course.courseDetails?.company_name}
              </Text>
              <Text style={styles.achievementType}>
                {course.courseDetails?.course_type}
              </Text>
              <Text style={styles.rate}>
                ⭐ 4.8 {"("}
                {course.courseDetails?.review}
                {")"}
              </Text>
              <Text style={styles.status}>
                Status:{" "}
                <Text style={styles.statusChange}>{course.courseStatus}</Text>
              </Text>
            </View>
            <Image
              source={require("../../assets/images/exploration.png")}
              style={styles.companyLogo}
            />
          </TouchableOpacity>
        ))}

        {/*Certificate Part*/}

        <Text style={styles.subheader}>Registered Certificates</Text>
        {certRegisterList.map((cert) => (
          <TouchableOpacity
            key={cert.certRegisted_id}
            style={styles.course_box}
          >
            <View style={styles.textContainer}>
              <Text style={styles.courseTitle}>
                {cert.certDetails?.cert_name}
              </Text>
              <Text style={styles.courseProvider}>
                {cert.certDetails?.company_name}
              </Text>
              <Text style={styles.achievementType}>
                {cert.certDetails?.cert_type}
              </Text>
              <Text style={styles.rate}>
                ⭐ 4.8 {"("}
                {cert.certDetails?.review}
                {")"}
              </Text>
              <Text style={styles.status}>
                Status:{" "}
                <Text style={styles.statusChange}>{cert.certStatus}</Text>
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

  boxTitle: {
    color: "#446cffff",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 6,
    paddingBottom: 10,
  },

  box: {
    width: "100%",
    height: "auto",
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
});
