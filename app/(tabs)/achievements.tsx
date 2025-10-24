import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";

export default function Homepage() {
  const router = useRouter();

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#d9efffff" }}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.headerTitle}>Learning & Achievements</Text>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#777"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="What do you want to learn"
            placeholderTextColor="#999"
          />
        </View>
        <Text style={styles.subheader}>Recommanded Courses</Text>
        {Array.from({ length: 4 }).map((_, index) => (
          <View key={index} style={styles.box}>
            <View style={styles.textContainer}>
              <Text style={styles.courseTitle}>
                Foundations: Data, Data, Data Everywhere
              </Text>
              <Text style={styles.courseProvider}>Google</Text>
              <Text style={styles.achievementType}>Course</Text>
              <Text style={styles.rate}>⭐ 4.8 {"(233k)"}</Text>
            </View>
            <Image
              source={require("../../assets/images/exploration.png")}
              style={styles.companyLogo}
            />
          </View>
        ))}

        <Text style={styles.subheader}>Recommanded Certificates</Text>
        {Array.from({ length: 4 }).map((_, index) => (
          <View key={index} style={styles.box}>
            <View style={styles.textContainer}>
              <Text style={styles.courseTitle}>
                Foundations: Data, Data, Data Everywhere
              </Text>
              <Text style={styles.courseProvider}>Google</Text>
              <Text style={styles.achievementType}>Course</Text>
              <Text style={styles.rate}>⭐ 4.8 {"(233k)"}</Text>
            </View>
            <Image
              source={require("../../assets/images/exploration.png")}
              style={styles.companyLogo}
            />
          </View>
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    marginTop: 50,
    padding: 15,
    paddingBottom: 100,
  },

  headerTitle: {
    color: "#8c92aaff",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 6,
  },

  subheader: {
    color: "#90a5f9ff",
    fontSize: 23,
    fontWeight: "700",
    marginBottom: 6,
    marginTop: 10,
  },
  _textInput: {
    width: "100%",
    marginBottom: 8,
    marginTop: 10,
    padding: 15,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#7b9ef6ff",
    fontSize: 16,
    backgroundColor: "#ffffffff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#7b9ef6ff",
    paddingHorizontal: 12,
    height: 50,
    marginTop: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },

  box: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 4,
    marginTop: 6,
  },

  companyLogo: {
    height: 65,
    width: 65,
    marginLeft: 20,
    borderRadius: 5,
  },

  textContainer: {
    flex: 1,
  },

  courseTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1B457C",
    flexShrink: 1,
    flexWrap: "wrap",
  },

  courseProvider: {
    fontSize: 14,
    color: "#6b6b6b",
    marginTop: 2,
  },

  achievementType: {
    fontSize: 14,
    color: "#8b8b8b",
    marginTop: 1,
  },

  rate: {
    fontSize: 14,
    color: "#8b8b8b",
    marginTop: 1,
  },
});
