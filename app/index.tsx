import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import React, { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../firebaseConfig";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Incorrect Email and Password");
      return;
    }

    try {
      setError("");
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const uid = user.uid;

      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        Alert.alert("Error", "User data not found");
        return;
      }

      const userData = userSnap.data();
      const user_role = userData.user_role;

      if (user_role === "job-seeker") {
        const educationQuery = query(
          collection(db, "education"),
          where("userId", "==", uid)
        );
        const eduSnapshot = await getDocs(educationQuery);
        const hasEducation = !eduSnapshot.empty;

        const skillQuery = query(
          collection(db, "careerProfile"),
          where("userId", "==", uid)
        );
        const skillSnapshot = await getDocs(skillQuery);
        const hasSkills = !skillSnapshot.empty;

        if (hasEducation && hasSkills) {
          router.push("/(job-seekerTabs)/home");
        } else {
          router.push("../job-seeker-page/educationSetup");
        }
      } else if (user_role === "employer") {
        const companyQuery = query(
          collection(db, "company"),
          where("userId", "==", uid)
        );
        const cmpSnapshot = await getDocs(companyQuery);
        const hasCompanySetup = !cmpSnapshot.empty;

        if (hasCompanySetup) {
          router.push("/(employerTabs)/home");
        } else {
          router.push("/employer-page/cmpInfoSetup");
        }
      } else {
        Alert.alert("Error", "Invalid user account");
      }
    } catch (err: any) {
      console.error(err);
      setError("Incorrect Email and Password");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#d9efffff" }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Login</Text>
          <Image
            source={require("../assets/images/logo.png")}
            style={styles.headerImg}
            alt="logo"
          />
          <Text style={styles.logoName}>SPACE</Text>
          <Text style={styles.systemName}>AI Career Guidance System</Text>
          <Text></Text>
        </View>

        <View style={styles.box}>
          <Text style={styles.label}>Email: </Text>
          <TextInput
            placeholder="Enter your email"
            style={[styles._textInput, error ? styles.errorInput : null]}
            onChangeText={(text) => {
              setEmail(text);
              setError("");
            }}
            value={email}
          />

          <Text style={styles.label}>Password: </Text>
          <TextInput
            placeholder="Enter your password"
            style={[styles._textInput, error ? styles.errorInput : null]}
            onChangeText={(text) => {
              setPassword(text);
              setError("");
            }}
            value={password}
            secureTextEntry
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <TouchableOpacity style={styles.btnLogin} onPress={handleLogin}>
            <Text style={styles.btnText}>Login</Text>
          </TouchableOpacity>

          <Text
            style={styles.forgotPswLabel}
            onPress={() => router.push("../auth-page/forgot-psw-email")}
          >
            Forgot Password ?
          </Text>
        </View>

        <Text style={styles.asking}>
          Don{"'"}t have an account yet?{" "}
          <Text
            style={styles.register}
            onPress={() => router.push("../auth-page/accountType")}
          >
            Sign up now
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: "6%",
    flex: 1,
  },

  register: {
    textDecorationLine: "underline",
    fontWeight: "500",
  },

  asking: {
    fontSize: 15,
    textAlign: "center",
    color: "#4a60c0ff",
    marginTop: "6%",
  },

  header: {
    marginVertical: "13%",
  },
  headerImg: {
    height: "43%",
    width: "43%",
    alignSelf: "center",
    marginBottom: "6%",
  },
  headerTitle: {
    color: "#8BA0FF",
    fontSize: 27,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: "1%",
    marginTop: "-5%",
  },
  logoName: {
    textAlign: "center",
    marginTop: "-7%",
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "serif",
  },
  systemName: {
    textAlign: "center",
    marginTop: 1,
    fontSize: 15,
    color: "#496affff",
    fontFamily: "serif",
  },

  box: {
    width: "100%",
    height: "48%",
    padding: 20,
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
    marginTop: "-45%",
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1B457C",
  },
  forgotPswLabel: {
    fontSize: 15,
    textAlign: "right",
    color: "#4a60c0ff",
    marginTop: "8%",
  },

  btnLogin: {
    padding: 10,
    borderWidth: 2,
    borderColor: "#7b9ef6ff",
    borderRadius: 30,
    width: "75%",
    alignSelf: "center",
    marginTop: "10%",
    backgroundColor: "#e7eeffff",
  },

  btnText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: "#1B457C",
  },

  _textInput: {
    marginBottom: 8,
    marginTop: 10,
    height: "16%",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#7b9ef6ff",
    fontSize: 16,
    paddingHorizontal: 10,
  },

  errorInput: {
    borderColor: "#e76161ff",
  },

  errorText: {
    color: "red",
    fontSize: 14,
    position: "absolute",
    top: "66%",
    right: "35%",
  },
});
