import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../firebaseConfig";
import { courses } from "./model/dataType";

export default function Homepage() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [course, setCourse] = useState<courses | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const docRef = doc(db, "courses", id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCourse({ course_id: docSnap.id, ...docSnap.data() } as courses);
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

  if (!course) {
    return (
      <View style={styles.center}>
        <Text>Certification not found</Text>
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
        <View style={styles.box}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Image
              source={require("../assets/images/logo.png")}
              style={styles.companyLogo}
            />
            <Text style={styles.certTitle}>{course.course_name}</Text>
            <Text style={styles.companyName}>{course.company_name}</Text>
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
            <Text style={styles.certType}>
              <Ionicons name="book" size={21} color="black" />
              {"  "}
              {course.course_type}
            </Text>
            <View
              style={{
                height: 2,
                backgroundColor: "#ccc",
                width: "100%",
                marginVertical: 12,
              }}
            />
            <Text style={styles.subheading}>Certificate Info:</Text>
            <Text style={styles.cert_description}>
              {course.course_description}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.btnApply}
            onPress={() => router.push("/(tabs)/learn")}
          >
            <Text style={styles.btnText}>Start</Text>
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

  certTitle: {
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
    padding: 7,
    borderWidth: 2,
    borderColor: "#7b9ef6ff",
    borderRadius: 25,
    width: "60%",
    alignSelf: "center",
    marginTop: 30,
    backgroundColor: "#e7eeffff",
  },

  btnText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: "#1B457C",
  },
});
