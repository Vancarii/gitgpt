import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useTheme } from "../context/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../App";

type CommitConfirmScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "CommitConfirm"
>;

const CommitConfirmScreen = () => {
  const navigation = useNavigation<CommitConfirmScreenNavigationProp>();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header with back button and title */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.navigate("Commit")}
        >
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Icon name="github" size={24} color={colors.text} />
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* Success message */}
      <View style={styles.contentContainer}>
        <Icon name="check-circle" size={70} color="#4CAF50" style={styles.successIcon} />
        
        <Text style={[styles.successMessage, { color: colors.text }]}>
          Your changes have been successfully committed to your repository!
        </Text>

        {/* Action buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.viewRepoButton]}
            onPress={() => console.log("View repository in GitHub Mobile")}
          >
            <Text style={styles.actionButtonText}>View Repository in GitHub Mobile</Text>
            <Icon name="external-link" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.backToChatButton, { backgroundColor: colors.card }]}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={[styles.backToChatText, { color: colors.text }]}>Back to Chat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    paddingTop: Platform.OS === "ios" ? 50 : 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  backButton: {
    padding: 8,
  },
  headerTitleContainer: {
    alignItems: "center",
  },
  placeholder: {
    width: 40, // Same width as back button to center the icon
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  successIcon: {
    marginBottom: 24,
  },
  successMessage: {
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 40,
    paddingHorizontal: 20,
    lineHeight: 26,
  },
  actionsContainer: {
    width: "100%",
    maxWidth: 400,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  viewRepoButton: {
    backgroundColor: "#4CAF50",
  },
  backToChatButton: {
    backgroundColor: "#333",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
    marginRight: 8,
  },
  backToChatText: {
    fontWeight: "600",
    fontSize: 16,
  },
});

export default CommitConfirmScreen;