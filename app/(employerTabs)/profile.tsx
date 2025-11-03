import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../../firebaseConfig";
import { Company } from "../model/dataType";

export default function Profilepage() {
  const router = useRouter();

  const [company, setCompany] = useState<Company | null>(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          Alert.alert("Error", "User not logged in");
          return;
        }

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          Alert.alert("User data not found");
          return;
        }

        const userData = userSnap.data();
        setUserName(userData.username || "User");
        setUserEmail(userData.email || user.email || "");

        if (userData.company_id) {
          const cmpRef = doc(db, "company", userData.company_id);
          const cmpSnap = await getDoc(cmpRef);
          if (cmpSnap.exists()) {
            setCompany(cmpSnap.data() as Company);
          }
        }
      } catch (error) {
        console.error(error);
        Alert.alert("Error fetching profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a60c0ff" />
        <Text>Loading profile data...</Text>
      </View>
    );
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert("Logged out successfully");
      router.replace("/");
    } catch {
      Alert.alert("Logout failed");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#C7D7FF", paddingTop: 50 }}>
      <KeyboardAvoidingView>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Profile</Text>
          </View>

          <Image
            source={require("../../assets/images/people.jpeg")}
            style={styles.headerImg}
          />

          <Text style={styles.profileName}>{userName}</Text>
          <View style={styles.box}>
            {/*Education */}
            <Text style={styles.firstheader}>Company Information</Text>
            <View
              style={{
                height: 2,
                backgroundColor: "#ccc",
                width: "100%",
                marginVertical: 12,
              }}
            />
            <Text style={styles.label}>Industry Type:</Text>
            <Text style={styles.profileData}>{company?._companyType}</Text>
            <Text style={styles.label}>Company Location:</Text>
            <Text style={styles.profileData}>{company?._companyLocation}</Text>
            <Text style={styles.label}>Company Size:</Text>
            <Text style={styles.profileData}>{company?._companySize}</Text>
            <Text style={styles.label}>Company Description:</Text>
            <Text style={styles.profileData}>
              {company?._companyDescription}
            </Text>
          </View>
          <TouchableOpacity style={styles.btnLogout} onPress={handleLogout}>
            <Text style={styles.btnText}>Sign out</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 40,
  },

  header: {
    marginVertical: 20,
  },

  headerTitle: {
    color: "#8c92aaff",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 6,
  },

  headerImg: {
    height: 90,
    width: 90,
    alignSelf: "center",
    marginBottom: 36,
    borderRadius: 100,
  },

  profileName: {
    textAlign: "center",
    marginTop: -25,
    marginBottom: 10,
    fontSize: 22,
    fontWeight: "bold",
    color: "#656e9eff",
  },

  box: {
    width: "100%",
    padding: 25,
    borderRadius: 30,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
    marginTop: 10,
  },
  // Profile data
  firstheader: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#003bb1ff",
    marginTop: 10,
    textAlign: "center",
  },

  subheader: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#003bb1ff",
    marginTop: 30,
    textAlign: "center",
  },

  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1B457C",
    marginTop: 10,
  },

  profileData: {
    fontSize: 18,
    fontWeight: "500",
    color: "#868686ff",
    marginTop: 10,
  },

  //Skill Profile

  skillContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 10,
  },

  skillData: {
    backgroundColor: "#E7EEFF",
    color: "#1B457C",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    fontSize: 17,
    fontWeight: "500",
  },

  //Career History Box

  careerHisotryContainer: {
    flexDirection: "column",
    gap: 15,
    marginTop: 10,
  },

  careerHistoryBox: {
    borderWidth: 2,
    backgroundColor: "#f5f8ffff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderColor: "#a5cafeff",
  },

  careerData: {
    padding: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#1B457C",
  },

  cmpName: {
    padding: 1,
    fontSize: 15,
    fontWeight: "500",
    color: "#606e81ff",
  },

  duration: {
    padding: 1,
    fontSize: 15,
    fontWeight: "500",
    color: "#606e81ff",
  },

  //Language containers
  languageContainer: {
    flexDirection: "column",
    gap: 10,
    marginTop: 10,
  },

  language: {
    padding: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#1B457C",
    backgroundColor: "#E7EEFF",
    paddingVertical: 7,
    paddingHorizontal: 13,
    borderRadius: 20,
  },

  // Button Logout
  btnLogout: {
    padding: 12,
    borderWidth: 2,
    borderColor: "#7b9ef6ff",
    borderRadius: 25,
    width: "75%",
    alignSelf: "center",
    marginTop: 35,
    backgroundColor: "#e7eeffff",
  },

  btnText: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
    color: "#1B457C",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
