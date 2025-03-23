"use client";
import { View, Text, StyleSheet } from "react-native";
import {
  DrawerContentScrollView,
  type DrawerContentComponentProps,
} from "@react-navigation/drawer";
import { useTheme } from "../context/ThemeContext";
import SidebarItem from "../components/SidebarItem";

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

  const navigateAndCloseDrawer = (screen: string, params?: any) => {
    navigation.closeDrawer();
    navigation.navigate(screen, params);
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
          onPress={() => console.log("Explore GPTs")}
        />

        <SidebarItem
          label="Integrations"
          icon="link"
          onPress={() => navigateAndCloseDrawer("Integrations")}
        />

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Previous 7 Days
          </Text>
        </View>

        {recentItems.slice(0, 3).map((item) => (
          <SidebarItem
            key={item.id}
            label={item.label}
            onPress={() => console.log(`Navigate to ${item.label}`)}
          />
        ))}

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Previous 30 Days
          </Text>
        </View>

        <SidebarItem
          label="BFS Algorithm in C++"
          onPress={() => console.log("Navigate to BFS Algorithm")}
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
            onPress={() => console.log(`Navigate to ${item.label}`)}
          />
        ))}
      </DrawerContentScrollView>

      <View style={styles.footer}>
        <SidebarItem
          label="Upgrade plan"
          icon="award"
          onPress={() => console.log("Upgrade plan")}
        />
        <Text style={styles.upgradeSubtitle}>
          More access to the best models
        </Text>

        <View style={styles.userContainer}>
          <View style={styles.userAvatar}>
            <Text style={styles.userInitials}>YW</Text>
          </View>
          <Text style={[styles.userName, { color: colors.text }]}>
            Yecheng Wang
          </Text>
        </View>
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
