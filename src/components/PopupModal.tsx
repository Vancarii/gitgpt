import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import CustomText from "./CustomText";

interface PopupModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  buttonText?: string;
}

const PopupModal: React.FC<PopupModalProps> = ({
  visible,
  onClose,
  title = "We're sorry!",
  description = "This page is not available yet, please check back later",
  buttonText = "Close",
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <View style={styles.headerContainer}>
                <CustomText style={styles.title}>{title}</CustomText>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Icon name="x" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              <View style={styles.contentContainer}>
                <Text style={styles.description}>{description}</Text>
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={onClose}
                  activeOpacity={0.8}
                >
                  <Text style={styles.buttonText}>{buttonText}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    width: Platform.OS === "web" ? 400 : "100%",
    maxWidth: 400,
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#333",
    ...Platform.select({
      web: {
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.25)",
      },
      default: {
        elevation: 5,
      },
    }),
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  closeButton: {
    padding: 4,
  },
  contentContainer: {
    padding: 20,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#DDDDDD",
    fontFamily: "OPTIDanley-Medium",
  },
  buttonContainer: {
    padding: 16,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#444654",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 150,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "OPTIDanley-Medium",
  },
});

export default PopupModal;
