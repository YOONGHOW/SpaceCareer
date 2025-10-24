import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ForogtPassword() {
  const router = useRouter();

  function handleOtp() {
    // after login success, go to tabs/home
    router.replace("/forgot-psw-otp");
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#d9efffff" }}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Forgot Password</Text>
        </View>
        <View style={styles.box}>
          <Text style={styles.label}>Email: </Text>
          <TextInput placeholder="Enter your email" style={styles._textInput} />

          <TouchableOpacity style={styles.btnLogin} onPress={handleOtp}>
            <Text style={styles.btnText}>Next</Text>
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
    marginTop: 200,
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

  backBtn: {
    position: "absolute",
    top: 40,
    left: 20,
    padding: 8,
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
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#7b9ef6ff",
    fontSize: 16,
  },
});
