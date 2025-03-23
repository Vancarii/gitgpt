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
import Icon from "react-native-vector-icons/Feather";
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
    // This would be a real authentication in a production app
    // just make it look real but its not
    setIsLoading(true);

    // Simulate API call delay with lol
    setTimeout(() => {
      setIsLoading(false);
      setIsConnected(true);
      navigation.navigate("Home");
    }, 500);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Icon name="github" size={60} color={colors.text} />
        <Text
          style={[
            styles.headerText,
            { color: colors.text, fontFamily: "OPTIDanley-Medium" },
          ]}
        >
          Sign in to GitHub
        </Text>
      </View>

      <View style={styles.formContainer}>
        <View style={[styles.inputContainer, { backgroundColor: colors.card }]}>
          <Text style={[styles.inputLabel, { color: colors.text }]}>
            Username or email address
          </Text>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={[styles.inputContainer, { backgroundColor: colors.card }]}>
          <Text style={[styles.inputLabel, { color: colors.text }]}>
            Password
          </Text>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={[styles.signInButton, { opacity: isLoading ? 0.7 : 1 }]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text
            style={[
              styles.signInButtonText,
              { fontFamily: "OPTIDanley-Medium" },
            ]}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={{ color: colors.text, opacity: 0.8 }}>
          New to GitHub? <Text style={styles.link}>Create an account</Text>.
        </Text>
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
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
  },
  inputContainer: {
    marginBottom: 16,
    borderRadius: 6,
    padding: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    height: 24,
  },
  signInButton: {
    backgroundColor: "#2EA043",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 16,
  },
  signInButtonText: {
    color: "#FFFFFF",
    fontWeight: "500",
    fontSize: 16,
  },
  footer: {
    marginTop: 40,
  },
  link: {
    color: "#2EA043",
  },
});

export default GitHubLoginScreen;
