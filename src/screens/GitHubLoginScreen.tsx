"use client";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "../context/ThemeContext";
import { useGitHub } from "../context/GitHubContext";
import type { RootStackParamList } from "../../App";

type GitHubLoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "GitHubLogin"
>;

const GitHubLoginScreen = () => {
  const navigation = useNavigation<GitHubLoginScreenNavigationProp>();
  const { colors } = useTheme();
  const { setIsConnected } = useGitHub();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false);
      setIsConnected(true);
      navigation.navigate("Home");
    }, 500);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerText, { color: colors.text }]}>
          Sign in to GitHub
        </Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputWrapper}>
          <Text style={[styles.inputLabel, { color: colors.text }]}>
            Username or email address
          </Text>
          <View
            style={[
              styles.inputContainer,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <TextInput
              style={[styles.input, { color: colors.text }]}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="e.g., Vancarii"
              placeholderTextColor={colors.text + "80"} // Add transparency
            />
          </View>
        </View>

        <View style={styles.inputWrapper}>
          <Text style={[styles.inputLabel, { color: colors.text }]}>
            Password
          </Text>
          <View
            style={[
              styles.inputContainer,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <TextInput
              style={[styles.input, { color: colors.text }]}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="******"
              placeholderTextColor={colors.text + "80"} // Add transparency
            />
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.signInButton,
            {
              backgroundColor: colors.accent,
              opacity: isLoading ? 0.7 : 1,
            },
          ]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={[styles.signInButtonText, { color: colors.buttonText }]}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "500",
    marginTop: 16,
    fontFamily: "OPTIDanley-Medium",
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
  },
  inputWrapper: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 4,
    fontFamily: "OPTIDanley-Medium",
  },
  inputContainer: {
    borderRadius: 6,
    borderWidth: 1,
    padding: 12,
  },
  input: {
    fontSize: 14,
    fontFamily: "OPTIDanley-Medium",
  },
  signInButton: {
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 16,
  },
  signInButtonText: {
    fontWeight: "500",
    fontSize: 16,
    fontFamily: "OPTIDanley-Medium",
  },
});

export default GitHubLoginScreen;
