import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRegistrationStore } from "./holdRegistrationData";

export default function RegisterScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  //Error State
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const setAll = useRegistrationStore((s) => s.setAll);

  const handleSignup = async () => {
    let isValid = true;
    try {
      setEmailError("");
      setPasswordError("");
      setConfirmError("");
      setUsernameError("");

      if (!username) {
        setUsernameError("Username is required");
        isValid = false;
      }

      if (!email) {
        setEmailError("Email is required");
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        setEmailError("Enter a valid email");
        isValid = false;
      }

      if (!password) {
        setPasswordError("Password is required");
        isValid = false;
      } else if (password.length < 8) {
        setPasswordError("Password must be at least 8 characters");
        isValid = false;
      }

      if (!confirmPassword) {
        setConfirmError("Please confirm your password");
        isValid = false;
      } else if (password !== confirmPassword) {
        setConfirmError("Passwords do not match");
        isValid = false;
      }

      if (!isValid) return;
      setAll({ username, email, password, confirmPassword });
      router.push("/auth-page/otpRequest");
    } catch {
      Alert.alert("Email already exists");
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
            onChangeText={(text) => {
              setUsername(text);
              setUsernameError("");
            }}
          />
          {usernameError ? (
            <Text style={styles.error}>{usernameError}</Text>
          ) : null}

          <Text style={styles.label}>Email: </Text>
          <TextInput
            placeholder="Enter your email"
            style={styles._textInput}
            onChangeText={(text) => {
              setEmail(text);
              setEmailError("");
            }}
            value={email}
          />
          {emailError ? <Text style={styles.error}>{emailError}</Text> : null}

          <Text style={styles.label}>Password: </Text>
          <TextInput
            placeholder="Enter your password"
            style={styles._textInput}
            onChangeText={(text) => {
              setPassword(text);
              setPasswordError("");
            }}
            value={password}
            secureTextEntry
          />
          {passwordError ? (
            <Text style={styles.error}>{passwordError}</Text>
          ) : null}

          <Text style={styles.label}>Confirm Password: </Text>
          <TextInput
            placeholder="Enter your password again"
            style={styles._textInput}
            onChangeText={(text) => {
              setConfirmPassword(text);
              setConfirmError("");
            }}
            value={confirmPassword}
            secureTextEntry
          />
          {confirmError ? (
            <Text style={styles.error}>{confirmError}</Text>
          ) : null}

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
    padding: "5%",
    flex: 1,
  },
  header: {
    marginVertical: "14%",
  },

  headerTitle: {
    color: "#8BA0FF",
    fontSize: 27,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: "2%",
  },

  box: {
    width: "100%",
    padding: 20,
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },

  label: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1B457C",
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
    height: 50,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#7b9ef6ff",
    fontSize: 16,
    paddingHorizontal: 10,
  },

  error: {
    color: "#de0000ff",
    fontSize: 12,
    marginTop: "-1%",
  },
});
