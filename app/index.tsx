import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
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
        Alert.alert("User data not found");
        return;
      }

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
        router.push("/(tabs)/home");
      } else {
        router.push("/educationSetup");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Login failed");
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
            style={styles._textInput}
            onChangeText={setEmail}
            value={email}
          />
          <Text style={styles.label}>Password: </Text>
          <TextInput
            placeholder="Enter your password"
            style={styles._textInput}
            onChangeText={setPassword}
            value={password}
            secureTextEntry
          />
          <TouchableOpacity style={styles.btnLogin} onPress={handleLogin}>
            <Text style={styles.btnText}>Login</Text>
          </TouchableOpacity>
          <Text
            style={styles.forgotPswLabel}
            onPress={() => router.push("/forgot-psw-email")}
          >
            Forgot Password ?
          </Text>
        </View>
        <Text style={styles.asking}>
          Don{"'"}t have an account yet?{" "}
          <Text
            style={styles.register}
            onPress={() => router.push("/register")}
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
    padding: 24,
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
    marginTop: 20,
  },

  header: {
    marginVertical: 36,
  },
  headerImg: {
    height: 150,
    width: 150,
    alignSelf: "center",
    marginBottom: 36,
  },
  headerTitle: {
    color: "#8BA0FF",
    fontSize: 27,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 6,
    marginTop: -30,
  },
  logoName: {
    textAlign: "center",
    marginTop: -40,
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
    marginTop: -25,
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
    marginTop: 25,
  },

  btnLogin: {
    padding: 10,
    borderWidth: 2,
    borderColor: "#7b9ef6ff",
    borderRadius: 30,
    width: "75%",
    alignSelf: "center",
    marginTop: 25,
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
  },
});
