"use client";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/Feather";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import type { RootStackParamList } from "../../App";

type UserSettingsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "UserSettings"
>;

const UserSettingsScreen = () => {
  const navigation = useNavigation<UserSettingsScreenNavigationProp>();
  const { colors, theme, toggleTheme } = useTheme();
  const { isLoggedIn, username, setIsLoggedIn, setUsername } = useAuth();

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername(null);
    navigation.navigate("Home");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="x" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Settings
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.profileSection}>
        <View
          style={[
            styles.profileAvatar,
            { backgroundColor: isLoggedIn ? "#B8860B" : "#666" },
          ]}
        >
          <Text style={styles.profileInitials}>
            {isLoggedIn && username
              ? username.substring(0, 2).toUpperCase()
              : "?"}
          </Text>
        </View>
        <Text style={[styles.profileName, { color: colors.text }]}>
          {isLoggedIn && username ? username : "Not logged in"}
        </Text>
      </View>

      <View style={[styles.section, { borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Account
        </Text>

        {isLoggedIn ? (
          <>
            <TouchableOpacity style={styles.settingItem}>
              <Icon name="user" size={20} color={colors.text} />
              <Text style={[styles.settingText, { color: colors.text }]}>
                My Account
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <Icon name="bell" size={20} color={colors.text} />
              <Text style={[styles.settingText, { color: colors.text }]}>
                Notifications
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <Icon name="lock" size={20} color={colors.text} />
              <Text style={[styles.settingText, { color: colors.text }]}>
                Privacy
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.logoutButton, { backgroundColor: "#F44336" }]}
              onPress={handleLogout}
            >
              <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={[styles.notLoggedInText, { color: colors.text }]}>
            Please log in to access account settings
          </Text>
        )}
      </View>

      <View style={[styles.section, { borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          General
        </Text>
        <TouchableOpacity style={styles.settingItem} onPress={toggleTheme}>
          <Icon name="moon" size={20} color={colors.text} />
          <Text style={[styles.settingText, { color: colors.text }]}>
            {theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Icon name="globe" size={20} color={colors.text} />
          <Text style={[styles.settingText, { color: colors.text }]}>
            Language
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.version, { color: colors.text }]}>
          GitGPT v1.0.0
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  profileSection: {
    alignItems: "center",
    padding: 20,
    marginBottom: 20,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#B8860B",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  profileInitials: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 32,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "600",
  },
  section: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  settingText: {
    fontSize: 16,
    marginLeft: 16,
  },
  logoutButton: {
    marginTop: 20,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
  notLoggedInText: {
    fontSize: 16,
    fontStyle: "italic",
    paddingVertical: 12,
  },
  footer: {
    padding: 20,
    alignItems: "center",
  },
  version: {
    fontSize: 14,
    opacity: 0.6,
  },
});

export default UserSettingsScreen;
