// filepath: /Users/yechengwang/Desktop/SFU/Spring2025/CMPT363/group-project/gitgpt/src/components/chat/WelcomeScreen.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import CustomText from "./CustomText";
import ActionButton from "./ActionButton";

interface WelcomeScreenProps {
  textColor: string;
  isConnected: boolean;
  onUnavailableFeature: () => void;
  onImportRepository: () => void;
  onGitHubLogin: () => void;
}

export const WelcomeScreen = ({
  textColor,
  isConnected,
  onUnavailableFeature,
  onImportRepository,
  onGitHubLogin,
}: WelcomeScreenProps) => {
  return (
    <View style={styles.welcomeContainer}>
      <CustomText style={[styles.welcomeText, { color: textColor }]}>
        Welcome, how can I help you today?
      </CustomText>

      <View style={styles.actionsContainer}>
        <ActionButton
          label="Create image"
          icon="image"
          onPress={onUnavailableFeature}
          style={styles.actionButton}
        />

        <ActionButton
          label="Help me write"
          icon="edit-2"
          onPress={onUnavailableFeature}
          style={styles.actionButton}
        />

        <ActionButton
          label="Brainstorm"
          icon="box"
          onPress={onUnavailableFeature}
          style={styles.actionButton}
        />

        {isConnected ? (
          <ActionButton
            label="Import Repository"
            icon="github"
            onPress={onImportRepository}
            style={styles.importButton}
          />
        ) : (
          <ActionButton
            label="GitHub Login"
            icon="github"
            onPress={onGitHubLogin}
            style={styles.gitHubButton}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  welcomeContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 28,
    textAlign: "center",
    marginBottom: 40,
  },
  actionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: 16,
    width: "100%",
  },
  actionButton: {
    width: "48%",
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  importButton: {
    width: "48%",
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#1F6E6D",
    padding: 2,
  },
  gitHubButton: {
    width: "48%",
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#6e5494",
    padding: 2,
  },
});
