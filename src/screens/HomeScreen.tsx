"use client";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import {
  useNavigation,
  type CompositeNavigationProp,
} from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { DrawerNavigationProp } from "@react-navigation/drawer";
import { useTheme } from "../context/ThemeContext";
import ActionButton from "../components/ActionButton";
import InputBar from "../components/InputBar";
import type { RootStackParamList, DrawerParamList } from "../../App";

type HomeScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<RootStackParamList, "Home">,
  DrawerNavigationProp<DrawerParamList>
>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { colors } = useTheme();

  const handleSend = (text: string) => {
    console.log("Message sent:", text);
    // Handle message logic here
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.welcomeContainer}>
          <Text style={[styles.welcomeText, { color: colors.text }]}>
            What can I help with?
          </Text>
        </View>

        <View style={styles.actionsContainer}>
          <ActionButton
            label="Create image"
            icon="image"
            onPress={() => console.log("Create image")}
            style={styles.actionButton}
          />

          <ActionButton
            label="Help me write"
            icon="edit-2"
            onPress={() => console.log("Help me write")}
            style={styles.actionButton}
          />

          <ActionButton
            label="Brainstorm"
            icon="bulb"
            onPress={() => console.log("Brainstorm")}
            style={styles.actionButton}
          />

          <ActionButton
            label="Import Repository"
            icon="github"
            onPress={() => navigation.navigate("RepositoryList")}
            style={styles.actionButton}
          />
        </View>
      </ScrollView>

      <View style={styles.inputContainer}>
        <InputBar onSend={handleSend} />
        <Text style={styles.disclaimer}>
          ChatGPT can make mistakes. Check important info.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 16,
  },
  welcomeContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "600",
    textAlign: "center",
  },
  actionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: 16,
  },
  actionButton: {
    width: "48%",
    marginBottom: 12,
  },
  inputContainer: {
    padding: 8,
  },
  disclaimer: {
    textAlign: "center",
    fontSize: 12,
    color: "#888",
    marginTop: 4,
    marginBottom: 8,
  },
});

export default HomeScreen;
