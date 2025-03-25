import React from "react";
import {
  View,
  StyleSheet,
  Platform,
  SafeAreaView,
  ViewStyle,
} from "react-native";

interface MobileSimulatorProps {
  children: React.ReactNode;
}

const MobileSimulator = ({ children }: MobileSimulatorProps) => {
  // Only apply the frame on web
  if (Platform.OS !== "web") {
    return <>{children}</>;
  }

  return (
    <View
      style={[
        styles.container,
        Platform.OS === "web" ? webStyles.fullHeight : {},
      ]}
    >
      <View style={styles.phoneFrame}>
        <View style={styles.notch} />
        <View style={styles.button} />
        <View style={styles.content}>
          <View style={styles.statusBarPadding} />
          {children}
        </View>
      </View>
    </View>
  );
};

// Define scale factor to resize the phone (0.9 = 90% of original size)
const SCALE_FACTOR = 0.85;

// Original dimensions
const ORIGINAL_WIDTH = 393;
const ORIGINAL_HEIGHT = 852;

// Scaled dimensions
const SCALED_WIDTH = ORIGINAL_WIDTH * SCALE_FACTOR;
const SCALED_HEIGHT = ORIGINAL_HEIGHT * SCALE_FACTOR;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  phoneFrame: {
    width: SCALED_WIDTH,
    height: SCALED_HEIGHT,
    backgroundColor: "#000",
    borderRadius: 45 * SCALE_FACTOR,
    overflow: "hidden",
    position: "relative",
    // boxShadow handled in webStyles
    borderWidth: 10 * SCALE_FACTOR,
    borderColor: "#000",
  },
  notch: {
    position: "absolute",
    top: 0,
    left: "50%",
    marginLeft: -75 * SCALE_FACTOR,
    width: 150 * SCALE_FACTOR,
    height: 38 * SCALE_FACTOR,
    backgroundColor: "#000",
    borderBottomLeftRadius: 18 * SCALE_FACTOR,
    borderBottomRightRadius: 18 * SCALE_FACTOR,
    zIndex: 1000,
  },
  button: {
    position: "absolute",
    right: -12 * SCALE_FACTOR,
    top: 120 * SCALE_FACTOR,
    width: 4 * SCALE_FACTOR,
    height: 30 * SCALE_FACTOR,
    backgroundColor: "#000",
    borderTopLeftRadius: 2 * SCALE_FACTOR,
    borderBottomLeftRadius: 2 * SCALE_FACTOR,
    zIndex: 1000,
  },
  content: {
    flex: 1,
    borderRadius: 36 * SCALE_FACTOR,
    overflow: "hidden",
    backgroundColor: "#1E1E1E",
  },
  statusBarPadding: {
    height: 30 * SCALE_FACTOR, // This gives space for the notch area
    width: "100%",
    backgroundColor: "#1E1E1E",
  },
});

// Create web-specific styles using a separate StyleSheet
const webStyles: Record<string, ViewStyle> =
  Platform.OS === "web"
    ? {
        fullHeight: {
          height: "100vh" as any, // Type assertion to bypass TypeScript check
          boxShadow: "0px 0px 30px rgba(0, 0, 0, 0.3)",
          backgrouncColor: "transparent",
        },
        boxShadow: {
          boxShadow: "0px 0px 30px rgba(0, 0, 0, 0.3)",
        },
      }
    : {};

export default MobileSimulator;
