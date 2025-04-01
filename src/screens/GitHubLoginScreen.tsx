"use client";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
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
  const [errorMessage, setErrorMessage] = useState("");

  const validateInputs = () => {
    if (!username.trim()) {
      setErrorMessage("Username or email cannot be empty");
      return false;
    }

    if (!password.trim()) {
      setErrorMessage("Password cannot be empty");
      return false;
    }

    setErrorMessage("");
    return true;
  };

  const handleLogin = () => {
    // Clear previous error
    setErrorMessage("");

    // Validate inputs
    if (!validateInputs()) {
      return;
    }

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
        {/* GitHub Logo */}
        {/* <View style={styles.logoContainer}>
          <Text style={[styles.githubIcon, { color: colors.text }]}>
            <Image
              source={require("../../assets/github-mark.png")}
              style={styles.githubIcon}
            />
          </Text>
        </View> */}
        <Text style={[styles.headerText, { color: colors.text }]}>
          Connect your GitHub account
        </Text>
        {/* <Text style={[styles.headerSubtext, { color: colors }]}>
          Access your repositories and collaborate seamlessly
        </Text> */}
      </View>

      <View style={styles.formContainer}>
        {errorMessage ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

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
              onChangeText={(text) => {
                setUsername(text);
                if (errorMessage) setErrorMessage("");
              }}
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
              onChangeText={(text) => {
                setPassword(text);
                if (errorMessage) setErrorMessage("");
              }}
              secureTextEntry
              placeholder="******"
              placeholderTextColor={colors.text + "80"}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.signInButton,
            {
              backgroundColor: "#6e40c9", // GitHub purple color
              opacity: isLoading ? 0.7 : 1,
            },
          ]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={styles.signInButtonText}>
            {isLoading ? "Connecting..." : "Connect to GitHub"}
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
  logoContainer: {
    marginBottom: 16,
    alignItems: "center",
  },
  githubIcon: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "600",
    marginTop: 5,
    fontFamily: "OPTIDanley-Medium",
    textAlign: "center",
  },
  headerSubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
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
    padding: 14,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 16,
  },
  signInButtonText: {
    fontWeight: "500",
    fontSize: 16,
    fontFamily: "OPTIDanley-Medium",
    color: "#ffffff",
  },
  errorContainer: {
    backgroundColor: "rgba(255, 0, 0, 0.1)",
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#FF3B30",
  },
  errorText: {
    color: "#FF3B30",
    fontWeight: "500",
  },
});

export default GitHubLoginScreen;
