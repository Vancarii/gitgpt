"use client";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  DrawerContentScrollView,
  type DrawerContentComponentProps,
} from "@react-navigation/drawer";
import { useTheme } from "../context/ThemeContext";
import SidebarItem from "../components/SidebarItem";
import { useAuth } from "../context/AuthContext";
import { usePopup } from "../context/PopupContext";

const recentItems = [
  { id: "1", label: "Count Good Subsequences C++" },
  { id: "2", label: "SQL Query for Companies" },
  { id: "3", label: "BFS Algorithm in C++" },
  { id: "4", label: "Minimize discomfort through sorting" },
  { id: "5", label: "Parenthesis DP Algorithm Explanation" },
  { id: "6", label: "IPC Issues with Threads" },
  { id: "7", label: "FlutterFlow Firebase Connection Issues" },
];

const SidebarScreen = (props: DrawerContentComponentProps) => {
  const { navigation } = props;
  const { colors } = useTheme();
  const { isLoggedIn, username } = useAuth();
  const { showPopup } = usePopup();

  const navigateAndCloseDrawer = (screen: string, params?: any) => {
    navigation.closeDrawer();
    navigation.navigate(screen, params);
  };

  // Use this function wherever you need to show the popup
  const handleUnavailableFeature = () => {
    showPopup({
      title: "We're sorry!",
      description: "This page is not available yet, please check back later",
      buttonText: "Close",
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <DrawerContentScrollView {...props} style={styles.content}>
        <SidebarItem
          label="ChatGPT"
          icon="message-square"
          onPress={() => navigateAndCloseDrawer("Home")}
          isActive={true}
        />

        <SidebarItem
          label="Explore GPTs"
          icon="compass"
          onPress={handleUnavailableFeature}
        />

        {/* Only show Integrations button if user is logged in */}
        {isLoggedIn && (
          <SidebarItem
            label="Integrations"
            icon="link"
            onPress={() => navigateAndCloseDrawer("Integrations")}
          />
        )}

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Previous 7 Days
          </Text>
        </View>

        {recentItems.slice(0, 3).map((item) => (
          <SidebarItem
            key={item.id}
            label={item.label}
            onPress={handleUnavailableFeature}
          />
        ))}

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Previous 30 Days
          </Text>
        </View>

        <SidebarItem
          label="BFS Algorithm in C++"
          onPress={handleUnavailableFeature}
        />

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            2024
          </Text>
        </View>

        {recentItems.slice(3).map((item) => (
          <SidebarItem
            key={item.id}
            label={item.label}
            onPress={handleUnavailableFeature}
          />
        ))}
      </DrawerContentScrollView>

      <View style={styles.footer}>
        <SidebarItem
          label="Upgrade plan"
          icon="award"
          onPress={handleUnavailableFeature}
        />
        <Text style={styles.upgradeSubtitle}>
          More access to the best models
        </Text>

        <TouchableOpacity
          style={styles.userContainer}
          onPress={() => {
            navigation.closeDrawer();
            if (isLoggedIn) {
              // If user is logged in, go to User Settings
              navigation.navigate("UserSettings");
            } else {
              // If user is not logged in, go to Login screen
              navigation.navigate("Login");
            }
          }}
        >
          <View style={styles.userAvatar}>
            <Text style={styles.userInitials}>
              {isLoggedIn && username
                ? username.substring(0, 2).toUpperCase()
                : "?"}
            </Text>
          </View>
          <Text style={[styles.userName, { color: colors.text }]}>
            {isLoggedIn && username ? username : "Not logged in"}
          </Text>
        </TouchableOpacity>
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
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "500",
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#333",
    paddingTop: 8,
  },
  upgradeSubtitle: {
    fontSize: 12,
    color: "#888",
    paddingHorizontal: 16,
    marginTop: -8,
    marginBottom: 16,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#B8860B",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  userInitials: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  userName: {
    fontSize: 16,
    fontWeight: "500",
  },
});

export default SidebarScreen;
