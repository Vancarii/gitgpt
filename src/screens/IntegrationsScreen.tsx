"use client";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "../context/ThemeContext";
import { useGitHub } from "../context/GitHubContext";
import type { RootStackParamList } from "../../App";

type IntegrationsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Integrations"
>;

const IntegrationsScreen = () => {
  const navigation = useNavigation<IntegrationsScreenNavigationProp>();
  const { colors } = useTheme();
  const { isConnected, setIsConnected } = useGitHub();

  const handleConnect = () => {
    if (isConnected) {
      // If already connected, disconnect
      setIsConnected(false);
    } else {
      // Navigate to GitHub login screen
      navigation.navigate("GitHubLogin");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.integrationItem}>
        <View style={styles.integrationHeader}>
          <Icon name="github" size={24} color={colors.text} />
          <Text style={[styles.integrationName, { color: colors.text }]}>
            GitHub
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.connectButton,
            {
              backgroundColor: isConnected ? "#F44336" : colors.primary,
            },
          ]}
          onPress={handleConnect}
        >
          <Text style={[styles.connectButtonText, { color: colors.text }]}>
            {isConnected ? "Disconnect" : "Connect"}
          </Text>
        </TouchableOpacity>
      </View>

      {isConnected && (
        <View style={styles.connectedMessage}>
          <Icon name="check-circle" size={18} color="#4CAF50" />
          <Text style={[styles.connectedText, { color: colors.text }]}>
            GitHub connected successfully
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  integrationItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  integrationHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  integrationName: {
    fontSize: 18,
    fontWeight: "500",
    marginLeft: 12,
  },
  connectButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  connectButtonText: {
    fontWeight: "500",
  },
  connectedMessage: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  connectedText: {
    marginLeft: 8,
  },
});

export default IntegrationsScreen;
