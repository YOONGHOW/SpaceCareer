import { useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";

export default function JobStatus() {
  const router = useRouter();

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#d9efffff" }}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.headerTitle}>My Applications</Text>

        {Array.from({ length: 2 }).map((_, index) => (
          <View key={index} style={styles.box}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.companyLogo}
            />
            <View style={styles.textContainer}>
              <Text style={styles.jobTitle}>
                Internship - Software Engineer
              </Text>
              <Text style={styles.companyName}>Google Inc.</Text>
              <Text style={styles.jobType}>Full Time</Text>
              <Text style={styles.location}>Kuala Lumpur, Malaysia</Text>
              <Text style={styles.salary}>RM1000 - RM1200</Text>
              <Text style={styles.status}>
                Status: <Text style={styles.statusChange}>Received</Text>
              </Text>
            </View>
          </View>
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

  status: {
    fontSize: 16,
    color: "#81a2faff",
    marginTop: 15,
    fontWeight: "bold",
  },

  statusChange: {
    fontSize: 15,
    color: "#abb8ffff",
    fontWeight: "bold",
  },
});
