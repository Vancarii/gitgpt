import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Linking,
  Animated,
  LayoutAnimation,
  UIManager,
} from "react-native";
import { Feather as Icon } from "@expo/vector-icons";

// Enable layout animations for Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Collapsible Section Component
interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
}) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View style={styles.collapsibleContainer}>
      <TouchableOpacity
        style={styles.collapsibleHeader}
        onPress={toggleExpand}
        activeOpacity={0.7}
      >
        <Text style={styles.collapsibleTitle}>{title}</Text>
        <Icon
          name={expanded ? "chevron-up" : "chevron-down"}
          size={20}
          color="#FFFFFF"
        />
      </TouchableOpacity>

      {expanded && <View style={styles.collapsibleContent}>{children}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  collapsibleContainer: {
    marginBottom: 20,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#333",
  },
  collapsibleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2D2D2D",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  collapsibleTitle: {
    fontSize: 18,
    color: "#FFFFFF",
    fontFamily: "OPTIDanley-Medium",
  },
  collapsibleContent: {
    marginTop: 16,
    backgroundColor: "#262626",
  },
});

export default CollapsibleSection;
