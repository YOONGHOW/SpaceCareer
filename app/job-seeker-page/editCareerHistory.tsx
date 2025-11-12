import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../../firebaseConfig";

export default function EditCareerHistory() {
  const router = useRouter();

  const [careerList, setCareerList] = useState([
    { company: "", position: "", description: "", duration: "" },
  ]);

  const handleAddBox = () => {
    setCareerList([
      ...careerList,
      { company: "", position: "", description: "", duration: "" },
    ]);
  };

  const handleUpdateCareer = async () => {
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
    const careerHisId = userData.careerHistory_id;

    try {
      if (!careerHisId) {
        const careerHisDocRef = doc(collection(db, "career_history"));
        const careerHisId = careerHisDocRef.id;

        const data = {
          career_id: careerHisId,
          userId: user.uid,
          careers: careerList,
        };

        await setDoc(careerHisDocRef, data);
        await updateDoc(userRef, { career_id: careerHisId });

        Alert.alert("Success", "Career history saved successfully!");
      } else {
        const careerDocRef = doc(db, "career", careerHisId);
        await updateDoc(careerDocRef, { careers: careerList });
        Alert.alert("Success", "Career history updated successfully!");
      }

      router.push("/(job-seekerTabs)/profile");
    } catch (error) {
      console.error("Error saving career history:", error);
      Alert.alert("Error", "Failed to save career history.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#d9efffff" }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.replace("/(job-seekerTabs)/profile")}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.headerTitle}>Career History</Text>
          </View>

          {careerList.map((item, index) => (
            <View key={index} style={styles.box}>
              <Text style={styles.label}>Company Name:</Text>
              <TextInput
                placeholder="Enter your company name"
                style={styles._textInput}
                value={item.company}
              />

              <Text style={styles.label}>Position:</Text>
              <TextInput
                placeholder="Enter your position"
                style={styles._textInput}
                value={item.position}
              />

              <Text style={styles.label}>Description:</Text>
              <TextInput
                placeholder="Enter your work description"
                style={styles._textInput}
                value={item.description}
              />

              <Text style={styles.label}>Work Duration:</Text>
              <TextInput
                placeholder="Enter your work duration"
                style={styles._textInput}
                value={item.duration}
              />
            </View>
          ))}

          <TouchableOpacity style={styles.addButton} onPress={handleAddBox}>
            <Text style={styles.addButtonText}>Add More</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnNext} onPress={handleUpdateCareer}>
            <Text style={styles.btnText}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  backBtn: {
    position: "absolute",
    top: 40,
    left: 20,
    padding: 8,
    zIndex: 10,
  },
  header: {
    marginVertical: 25,
    marginTop: 60,
  },
  headerTitle: {
    color: "#8BA0FF",
    fontSize: 27,
    fontWeight: "700",
    textAlign: "center",
  },
  box: {
    width: "100%",
    padding: 25,
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 15,
  },
  label: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1B457C",
  },
  _textInput: {
    marginBottom: 6,
    marginTop: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#7b9ef6ff",
    fontSize: 16,
    padding: 10,
  },
  addButton: {
    padding: 8,
    borderWidth: 2,
    borderColor: "#7b9ef6ff",
    borderRadius: 20,
    alignSelf: "center",
    backgroundColor: "#ffffffff",
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1B457C",
    textAlign: "center",
  },
  btnNext: {
    padding: 12,
    borderWidth: 2,
    borderColor: "#7b9ef6ff",
    borderRadius: 30,
    width: "75%",
    alignSelf: "center",
    marginVertical: 25,
    backgroundColor: "#e7eeffff",
  },
  btnText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: "#1B457C",
  },
});
