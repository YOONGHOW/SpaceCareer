import { useRouter } from "expo-router";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../../firebaseConfig";

export default function CompanySetup() {
  const router = useRouter();
  const user = auth.currentUser;
  const [company_name, setCompanyName] = useState("");
  const [_companyType, setCompanyType] = useState("");
  const [_companySize, setCompanySize] = useState("");
  const [_companyLocation, setCompanyLocation] = useState("");
  const [_companyDescription, setCompanyDescription] = useState("");

  useEffect(() => {
    const fetchCompanyName = async () => {
      if (!user) return;
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        setCompanyName(data.username);
      }
    };
    fetchCompanyName();
  }, [user]);

  if (!user) {
    return;
  }

  const handleCompanyProfile = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Error", "User not logged in");
        return;
      }

      const newDocRef = doc(collection(db, "company"));

      const data = {
        company_id: newDocRef.id,
        userId: user.uid,
        company_name,
        _companyType,
        _companySize,
        _companyLocation,
        _companyDescription,
      };

      await setDoc(newDocRef, data);

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        company_id: newDocRef.id,
      });

      Alert.alert("Success", "Company profile set up successfully!");
      router.push("/(employerTabs)/home");
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#d9efffff" }}>
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Let’s Get to Know You</Text>
            </View>

            <View style={styles.box}>
              <Text style={styles.boxTitle}>Company Information</Text>

              <Text style={styles.label}>Industry type:</Text>
              <TextInput
                style={styles._textInput}
                placeholder="Enter your industry type"
                value={_companyType}
                onChangeText={setCompanyType}
              />

              <Text style={styles.label}>Company Size:</Text>
              <TextInput
                style={styles._textInput}
                placeholder="Enter your company size"
                value={_companySize}
                onChangeText={setCompanySize}
              />

              <Text style={styles.label}>Company Location:</Text>
              <TextInput
                style={styles._textInput}
                placeholder="Enter your company location"
                value={_companyLocation}
                onChangeText={setCompanyLocation}
              />

              <Text style={styles.label}>Company Description:</Text>
              <TextInput
                style={styles._textAreaInput}
                placeholder="Enter your company description"
                value={_companyDescription}
                onChangeText={setCompanyDescription}
                multiline={true}
                textAlignVertical="top"
              />

              <TouchableOpacity
                style={styles.btnNext}
                onPress={handleCompanyProfile}
              >
                <Text style={styles.btnText}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 50,
  },
  container: {
    padding: 24,
    flex: 1,
  },
  _textAreaInput: {
    marginBottom: 8,
    marginTop: 10,
    minHeight: 100,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#7b9ef6ff",
    fontSize: 16,
    paddingHorizontal: 10,
  },
  header: {
    marginVertical: 30,
    marginTop: 50,
  },
  headerTitle: {
    color: "#8BA0FF",
    fontSize: 25,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 6,
  },
  boxTitle: {
    color: "#446cffff",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 6,
    paddingBottom: 10,
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
    fontSize: 16,
    fontWeight: "600",
    color: "#1B457C",
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
});
