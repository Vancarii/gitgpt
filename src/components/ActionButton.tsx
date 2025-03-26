"use client";

import type React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useTheme } from "../context/ThemeContext";

interface ActionButtonProps {
  label: string;
  icon: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  icon,
  onPress,
  style,
  textStyle,
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: colors.buttonBackground,
          borderColor: colors.border,
        },
        style,
      ]}
      onPress={onPress}
    >
      <Icon name={icon} size={18} color={colors.text} style={styles.icon} />
      <Text style={[styles.label, { color: colors.text }, textStyle]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    borderWidth: 1,
    marginVertical: 6,
    boxShadow: "0px 5px 5px rgba(0, 0, 0, 0.3)",
  },
  icon: {
    marginRight: 8,
  },
  label: {
    fontSize: 10,
    fontWeight: "500",
  },
});

export default ActionButton;
