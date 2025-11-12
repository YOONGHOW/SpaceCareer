import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import React, { useRef, useState } from "react";
import { auth, db } from "../../firebaseConfig";

import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRegistrationStore } from "./holdRegistrationData";
import { SendEmail } from "./send-email";
export default function OTPVerification() {
  const router = useRouter();
  const { username, email, password, reset } = useRegistrationStore();
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);

  const inputs = useRef<(TextInput | null)[]>([]).current;

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-focus next input if not last
    if (text && index < 5) {
      inputs[index + 1]?.focus();
    }
  };

  const handleStoreUser = async () => {
    SendEmail(
      email,
      "Use OTP To Verify Your Identity",
      "Hi, Your SpaceCareer OTP Code is: 950738, valid for 15 mins. NEVER share this code with others, including SpaceCareer staff."
    );

    try {
      const user_role = "job-seeker";

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        email,
        username,
        user_role,
        createdAt: new Date().toISOString(),
      });
      Alert.alert("Signup successful");
      reset();
      router.push("/");
    } catch {
      Alert.alert("Email already exists");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Image
        source={require("../../assets/images/secure_mail.png")}
        style={styles.headerImg}
        alt="logo"
      />

      <Text style={styles.title}>Verify OTP</Text>
      <Text style={styles.subtitle}>
        Enter the 6-digit code sent to yoonghow123@gmail.com
      </Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.otpInput}
            value={digit}
            keyboardType="number-pad"
            maxLength={1}
            onChangeText={(text: string) => handleChange(text, index)}
            ref={(ref) => {
              inputs[index] = ref; // ref is TextInput | null
            }}
          />
        ))}
      </View>

      <Text style={styles.resendText}>
        Didn{"'"}t receive code?{" "}
        <Text style={{ color: "#007bff" }}>Resend OTP</Text>
      </Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText} onPress={handleStoreUser}>
          Verify OTP
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#d9efffff",
  },

  backBtn: {
    position: "absolute",
    top: 95,
    left: 20,
    padding: 8,
  },

  headerImg: {
    height: 110,
    width: 110,
    alignSelf: "center",
    marginBottom: 36,
  },

  otpText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007bff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "gray",
    marginBottom: 20,
    textAlign: "center",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  otpInput: {
    width: 45,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 18,
    marginHorizontal: 5,
    backgroundColor: "#fff",
  },
  resendText: {
    marginBottom: 20,
    fontSize: 14,
    color: "gray",
  },

  button: {
    padding: 10,
    borderWidth: 2,
    borderColor: "#7b9ef6ff",
    borderRadius: 30,
    width: "75%",
    alignSelf: "center",
    marginTop: 25,
    backgroundColor: "#e7eeffff",
  },
  buttonText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: "#1B457C",
  },
});
