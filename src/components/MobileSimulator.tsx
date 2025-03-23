import React from "react";
import { View, StyleSheet, Platform, SafeAreaView } from "react-native";

interface MobileSimulatorProps {
  children: React.ReactNode;
}

const MobileSimulator = ({ children }: MobileSimulatorProps) => {
  // Only apply the frame on web
  if (Platform.OS !== "web") {
    return <>{children}</>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.phoneFrame}>
        <View style={styles.notch} />
        <View style={styles.button} />
        <View style={styles.content}>
          {/* Add extra padding at the top to account for the notch */}
          <View style={styles.statusBarPadding} />
          {children}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    height: "100vh",
  },
  phoneFrame: {
    width: 393,
    height: 852,
    backgroundColor: "#000",
    borderRadius: 50,
    overflow: "hidden",
    position: "relative",
    boxShadow: "0px 0px 30px rgba(0, 0, 0, 0.3)",
    borderWidth: 10,
    borderColor: "#000",
  },
  notch: {
    position: "absolute",
    top: 0,
    left: "50%",
    marginLeft: -75,
    width: 150,
    height: 38,
    backgroundColor: "#000",
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    zIndex: 1000,
  },
  button: {
    position: "absolute",
    right: -12,
    top: 120,
    width: 4,
    height: 30,
    backgroundColor: "#000",
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
    zIndex: 1000,
  },
  content: {
    flex: 1,
    borderRadius: 40,
    overflow: "hidden",
    backgroundColor: "#1E1E1E",
  },
  statusBarPadding: {
    height: 30, // This gives space for the notch area
    width: "100%",
    backgroundColor: "#1E1E1E",
  },
});

export default MobileSimulator;
