import React, { useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

export default function RegisterScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      Alert.alert(
        "Passwords do not match",
        "Please re-enter the same password."
      );
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        email,
        username,
        createdAt: new Date().toISOString(),
      });
      Alert.alert("Signup successful");
      router.push("/otpRequest");
    } catch {
      Alert.alert("Signup failed");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#d9efffff" }}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Sign Up</Text>
        </View>
        <View style={styles.box}>
          <Text style={styles.label}>Username: </Text>
          <TextInput
            placeholder="Enter your name"
            style={styles._textInput}
            value={username}
            onChangeText={setUsername}
          />
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
          <Text style={styles.label}>Confirm Password: </Text>
          <TextInput
            placeholder="Enter your password again"
            style={styles._textInput}
            onChangeText={setConfirmPassword}
            value={confirmPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.btnNext} onPress={handleSignup}>
            <Text style={styles.btnText}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
  },
  header: {
    marginVertical: 36,
    marginTop: 80,
  },

  headerTitle: {
    color: "#8BA0FF",
    fontSize: 27,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 6,
  },

  box: {
    width: "100%",
    height: "70%",
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

  label: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1B457C",
  },
  forgotPswLabel: {
    fontSize: 15,
    textAlign: "right",
    color: "#4a60c0ff",
    marginTop: 30,
  },

  backBtn: {
    position: "absolute",
    top: 40,
    left: 20,
    padding: 8,
  },

  btnNext: {
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
    height: "11%",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#7b9ef6ff",
    fontSize: 16,
  },
});
