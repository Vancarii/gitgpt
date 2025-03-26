"use client";

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

interface RepositoryCardProps {
  name: string;
  onPress: () => void;
  language?: string;
  stars?: number;
  forks?: number;
  description?: string;
  isPrivate?: boolean;
}

const RepositoryCard: React.FC<RepositoryCardProps> = ({
  name,
  onPress,
  language = "JavaScript",
  stars = 0,
  forks = 0,
  description = "No description provided",
  isPrivate = false,
}) => {
  const { colors } = useTheme();

  // Function to get language color
  const getLanguageColor = (lang: string) => {
    const colorMap: Record<string, string> = {
      JavaScript: "#f1e05a",
      TypeScript: "#3178c6",
      Python: "#3572A5",
      Java: "#b07219",
      C: "#555555",
      "C++": "#f34b7d",
      "C#": "#178600",
      Ruby: "#701516",
      PHP: "#4F5D95",
      HTML: "#e34c26",
      CSS: "#563d7c",
      Go: "#00ADD8",
      Rust: "#dea584",
      Swift: "#ffac45",
    };
    return colorMap[lang] || "#8257e5"; // Default purple color
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.headerContainer}>
        <View style={styles.nameContainer}>
          <Icon
            name={isPrivate ? "lock" : "github"}
            size={16}
            color={colors.text}
            style={styles.icon}
          />
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
            {name}
          </Text>
        </View>
        <View
          style={[
            styles.privateContainer,
            { backgroundColor: isPrivate ? "#333" : "transparent" },
          ]}
        >
          {isPrivate && <Text style={styles.privateText}>Private</Text>}
        </View>
      </View>

      <Text
        style={[styles.description, { color: colors.text }]}
        numberOfLines={2}
      >
        {description}
      </Text>

      <View style={styles.footer}>
        <View style={styles.languageContainer}>
          <View
            style={[
              styles.languageDot,
              { backgroundColor: getLanguageColor(language) },
            ]}
          />
          <Text style={[styles.footerText, { color: colors.text }]}>
            {language}
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Icon
              name="star"
              size={14}
              color={colors.text}
              style={styles.statIcon}
            />
            <Text style={[styles.footerText, { color: colors.text }]}>
              {stars}
            </Text>
          </View>

          <View style={styles.stat}>
            <Icon
              name="git-branch"
              size={14}
              color={colors.text}
              style={styles.statIcon}
            />
            <Text style={[styles.footerText, { color: colors.text }]}>
              {forks}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    borderWidth: 1,
    width: "90%",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  icon: {
    marginRight: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "OPTIDanley-Medium",
    flex: 1,
  },
  privateContainer: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  privateText: {
    fontSize: 10,
    color: "#ccc",
    fontWeight: "500",
  },
  description: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  languageContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  languageDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  footerText: {
    fontSize: 12,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },
  statIcon: {
    marginRight: 4,
  },
});

export default RepositoryCard;
