import React from "react";
import { Text, TextProps, StyleSheet } from "react-native";

const CustomText: React.FC<TextProps> = ({ style, children, ...props }) => {
  return (
    <Text {...props} style={[styles.defaultText, style]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  defaultText: {
    fontFamily: "OPTIDanley-Medium", // Apply the custom font
    color: "#FFFFFF", // Default text color (optional)
  },
});

export default CustomText;
