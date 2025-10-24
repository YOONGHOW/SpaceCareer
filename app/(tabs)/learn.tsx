import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  KeyboardAvoidingView,
} from "react-native";

export default function LearningPage() {
  const router = useRouter();

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
        {Array.from({ length: 2 }).map((_, index) => (
          <View key={index} style={styles.course_box}>
            <View style={styles.textContainer}>
              <Text style={styles.courseTitle}>
                Foundations: Data, Data, Data Everywhere
              </Text>
              <Text style={styles.courseProvider}>Google</Text>
              <Text style={styles.achievementType}>Course</Text>
              <Text style={styles.rate}>⭐ 4.8 {"(233k)"}</Text>
            </View>
            <Image
              source={require("../../assets/images/exploration.png")}
              style={styles.companyLogo}
            />
          </View>
        ))}

        <Text style={styles.subheader}>Registered Certificates</Text>
        {Array.from({ length: 2 }).map((_, index) => (
          <View key={index} style={styles.course_box}>
            <View style={styles.textContainer}>
              <Text style={styles.courseTitle}>
                Foundations: Data, Data, Data Everywhere
              </Text>
              <Text style={styles.courseProvider}>Google</Text>
              <Text style={styles.achievementType}>Course</Text>
              <Text style={styles.rate}>⭐ 4.8 {"(233k)"}</Text>
            </View>
            <Image
              source={require("../../assets/images/exploration.png")}
              style={styles.companyLogo}
            />
          </View>
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
});
