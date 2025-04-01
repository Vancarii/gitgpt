import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import { CodeSection } from "../types/ChatTypes";

interface CodeResponseComponentProps {
  content: string;
  codeSections: CodeSection[];
  colors: any;
  onCopy: () => void;
  onViewFullCode: (code: string) => void;
}

export const CodeResponseComponent = ({
  content,
  codeSections,
  colors,
  onCopy,
  onViewFullCode,
}: CodeResponseComponentProps) => {
  // Split the message content by code block placeholders
  const contentParts = content.split(/\[CODE_BLOCK_(\d+)\]/);

  return (
    <View style={styles.messageTextContainer}>
      {contentParts.map((part, index) => {
        if (index % 2 === 0) {
          // This is regular text
          return part ? (
            <Text
              key={`text-${index}`}
              style={[styles.messageText, { color: colors.text }]}
            >
              {part}
            </Text>
          ) : null;
        } else {
          // This is a code block placeholder
          const codeIndex = parseInt(part);
          const codeSection = codeSections?.[codeIndex];

          if (!codeSection) return null;

          return (
            <View key={`code-${index}`} style={styles.codeBlockContainer}>
              <View
                style={[
                  styles.codeBlockHeader,
                  { backgroundColor: colors.codeBackground },
                ]}
              >
                <Text style={styles.codeLanguageLabel}>
                  {codeSection.language || "text"}
                </Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={[
                  styles.codeScrollContainer,
                  { backgroundColor: colors.codeBackground },
                ]}
              >
                <View style={styles.codeContentContainer}>
                  {/* Line Numbers Column */}
                  <View style={styles.lineNumbersColumn}>
                    {codeSection.code.split("\n").map((_, lineIndex) => (
                      <Text key={lineIndex} style={styles.lineNumber}>
                        {lineIndex + 1}
                      </Text>
                    ))}
                  </View>

                  {/* Code Content */}
                  <View style={styles.codeTextColumn}>
                    <Text style={styles.codeText}>{codeSection.code}</Text>
                  </View>
                </View>
              </ScrollView>
              <View
                style={[
                  styles.codeBlockFooter,
                  { backgroundColor: colors.codeBackground },
                ]}
              >
                <TouchableOpacity style={styles.codeButton} onPress={onCopy}>
                  <Icon name="copy" size={16} color="#FFFFFF" />
                  <Text style={styles.codeButtonText}>Copy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.codeButton}
                  onPress={() => onViewFullCode(codeSection.code)}
                >
                  <Text style={styles.codeButtonText}>Open in Editor</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  messageTextContainer: {
    width: "100%",
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  codeBlockContainer: {
    // marginVertical: 12,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#333",
  },
  codeBlockHeader: {
    flexDirection: "row",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  codeLanguageLabel: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "500",
    opacity: 0.7,
  },
  codeScrollContainer: {
    maxHeight: 300, // Limit max height of code blocks
  },
  codeContentContainer: {
    flexDirection: "row",
    padding: 10,
    minWidth: "100%",
  },
  lineNumbersColumn: {
    marginRight: 12,
    paddingRight: 8,
    alignItems: "flex-end",
    borderRightWidth: 1,
    borderRightColor: "rgba(255, 255, 255, 0.1)",
  },
  lineNumber: {
    fontSize: 12,
    lineHeight: 20,
    color: "#606366",
    fontFamily: "monospace",
    textAlign: "right",
  },
  codeTextColumn: {
    flex: 1,
  },
  codeText: {
    fontSize: 12,
    lineHeight: 20,
    color: "#A9B7C6",
    fontFamily: "monospace",
    padding: 0,
  },
  codeBlockFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  codeButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 6,
    borderRadius: 4,
    marginLeft: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  codeButtonText: {
    color: "#FFFFFF",
    marginLeft: 4,
    fontSize: 12,
  },
});
