import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../../firebaseConfig";

export default function EditLanguage() {
  const router = useRouter();
  const [_language1, setLanguage1] = useState("");
  const [_language2, setLanguage2] = useState("");
  const [_language3, setLanguage3] = useState("");

  const handleUpdateLanguage = async () => {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Error", "User data not found");
      return;
    }

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      Alert.alert("Error", "User data not found");
      return;
    }
    const userData = userSnap.data() || {};
    const languageId = userData.language_id;

    if (!languageId) {
      const languageDocRef = doc(collection(db, "language"));

      const languageID = languageDocRef.id;
      const data = {
        language_id: languageID,
        userId: user.uid,
        language_1: _language1 || null,
        language_2: _language2 || null,
        language_3: _language3 || null,
      };
      await setDoc(languageDocRef, data);
      await updateDoc(userRef, {
        language_id: languageID,
      });

      Alert.alert("Success", "Update Language Successfully!");
      router.push("/(job-seekerTabs)/profile");
    } else {
      const languageDocRef = doc(db, "language", languageId);
      await updateDoc(languageDocRef, {
        language_1: _language1 || null,
        language_2: _language2 || null,
        language_3: _language3 || null,
      });
      Alert.alert("Success", "Update Language Successfully!");
      router.push("/(job-seekerTabs)/profile");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#d9efffff" }}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.replace("/(job-seekerTabs)/profile")}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Languages</Text>
        </View>
        <View style={styles.box}>
          <Text style={styles.label}>Language 1:</Text>
          <TextInput
            placeholder="Enter your language 1"
            style={styles._textInput}
            value={_language1}
            onChangeText={(text) => {
              setLanguage1(text);
            }}
          />
          <Text style={styles.label}>Language 2:</Text>
          <TextInput
            placeholder="Enter your language 2"
            style={styles._textInput}
            value={_language2}
            onChangeText={(text) => {
              setLanguage2(text);
            }}
          />
          <Text style={styles.label}>Language 3:</Text>
          <TextInput
            placeholder="Enter your language 3"
            style={styles._textInput}
            value={_language3}
            onChangeText={(text) => {
              setLanguage3(text);
            }}
          />
          <TouchableOpacity
            style={styles.btnNext}
            onPress={handleUpdateLanguage}
          >
            <Text style={styles.btnText}>Save</Text>
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
  backBtn: {
    position: "absolute",
    top: 40,
    left: 20,
    padding: 8,
  },

  header: {
    marginVertical: 36,
    marginTop: 100,
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

  label: {
    fontSize: 18,
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
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#7b9ef6ff",
    fontSize: 16,
  },
});
