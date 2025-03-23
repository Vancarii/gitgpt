"use client";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "../context/ThemeContext";
import type { RootStackParamList } from "../../App";

type IntegrationsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Integrations"
>;

const IntegrationsScreen = () => {
  const navigation = useNavigation<IntegrationsScreenNavigationProp>();
  const { colors } = useTheme();

  const handleConnect = () => {
    // Simulate GitHub connection
    setTimeout(() => {
      navigation.navigate("RepositoryList");
    }, 1000);
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
          style={[styles.connectButton, { backgroundColor: colors.primary }]}
          onPress={handleConnect}
        >
          <Text style={[styles.connectButtonText, { color: colors.text }]}>
            Connect
          </Text>
        </TouchableOpacity>
      </View>
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
});

export default IntegrationsScreen;
