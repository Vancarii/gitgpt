"use client";

import { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useTheme } from "../context/ThemeContext";
import type { RootStackParamList } from "../../App";

import {
  useNavigation,
  useRoute,
  type RouteProp,
} from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

const initialCode = `#include <iostream>
#include <vector>
#include <queue>

using namespace std;

class Graph {
    int V; // Number of vertices
    vector<vector<int>> adj; // Adjacency list
  
public:
    Graph(int V)
    {
        this->V = V;
        adj.resize(V);
    }
    
    // Add an edge to the graph
    void addEdge(int v, int w)
    {
        adj[v].push_back(w);
    }

    // Breadth First Search algorithm
    void BFS(int start)
    {
        vector<bool> visited(V, false);
        queue<int> queue;
        
        visited[start] = true;
        queue.push(start);
        
        while (!queue.empty()) {
            start = queue.front();
            cout << start << " ";
            queue.pop();
            
            for (auto adjacent : adj[start]) {
                if (!visited[adjacent]) {
                    visited[adjacent] = true;
                    queue.push(adjacent);
                }
            }
        }
    }
};`;

// Add navigation type
type CodeEditorScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "CodeEditor"
>;

// Define the route prop type
type CodeEditorScreenRouteProp = RouteProp<RootStackParamList, "CodeEditor">;

const CodeEditorScreen = () => {
  const route = useRoute<CodeEditorScreenRouteProp>();
  const navigation = useNavigation<CodeEditorScreenNavigationProp>();
  const { colors } = useTheme();
  const [code, setCode] = useState(initialCode);
  const [highlighted, setHighlighted] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);
  const textInputRef = useRef<TextInput>(null);

  // Define which lines to highlight (line numbers are 0-indexed in the array)
  const highlightStartLine = 17; // Line 22 (0-indexed)
  const highlightEndLine = 21; // Line 27 (0-indexed)

  const { fileName } = route.params;

  // Function to dismiss keyboard
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  // Function to handle accepting changes
  const handleAcceptChanges = () => {
    setHighlighted(false);
    // Here you would typically save the changes
  };

  // Function to handle declining changes
  const handleDeclineChanges = () => {
    setHighlighted(false);
    setCode(initialCode);
  };

  // Insert special character at current cursor position
  const insertAtCursor = (char: string) => {
    if (textInputRef.current && textInputRef.current.isFocused()) {
      const currentCode = code;
      // Since we can't get cursor position easily in React Native,
      // we'll just append to the end for this demo
      setCode(currentCode + char);
    }
  };

  // Render line numbers for reference (not actual TextInput line numbers)
  const renderLineNumbers = () => {
    const lines = code.split("\n");
    return (
      <View style={styles.lineNumbers}>
        {lines.map((_, index) => {
          // Determine if this line should be highlighted
          const isHighlighted =
            highlighted &&
            index >= highlightStartLine &&
            index <= highlightEndLine;

          return (
            <View
              key={index}
              style={[
                styles.lineNumberContainer,
                isHighlighted && styles.highlightedLineNumber,
              ]}
            >
              <Text
                style={[
                  styles.lineNumber,
                  isHighlighted && { color: "#FFFFFF" },
                ]}
              >
                {index + 1}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };

  // Render highlighted section bars if highlighted state is true
  const renderHighlightedSection = () => {
    if (!highlighted) return null;

    return (
      <View style={styles.highlightedSectionContainer}>
        <View style={styles.highlightedSectionHeader}>
          <Text style={styles.highlightedSectionTitle}>
            Suggested changes in lines {highlightStartLine + 1} to{" "}
            {highlightEndLine + 1}
          </Text>
          <View style={styles.highlightedSectionButtons}>
            <TouchableOpacity
              style={[styles.highlightButton, { backgroundColor: "#4CAF50" }]}
              onPress={handleAcceptChanges}
            >
              <Text style={styles.highlightButtonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.highlightButton, { backgroundColor: "#F44336" }]}
              onPress={handleDeclineChanges}
            >
              <Text style={styles.highlightButtonText}>Decline</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  // Render key buttons for common code symbols
  const renderKeyButtons = () => {
    const keys = ["{", "}", "(", ")", "[", "]", ";", "=", "+", "→"];

    return (
      <View style={styles.keyButtonsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {keys.map((key, index) => (
            <TouchableOpacity
              key={index}
              style={styles.keyButton}
              onPress={() => insertAtCursor(key)}
            >
              <Text style={styles.keyButtonText}>{key}</Text>
            </TouchableOpacity>
          ))}
          {/* <TouchableOpacity
            style={[styles.keyButton, styles.keyboardDismissButton]}
            onPress={dismissKeyboard}
          >
            <Icon name="chevron-down" size={20} color="#FFFFFF" />
          </TouchableOpacity> */}
        </ScrollView>
      </View>
    );
  };

  // Function to render the code with highlighted lines
  const renderCodeWithHighlight = () => {
    const lines = code.split("\n");

    return (
      <View style={styles.codeInputContainer}>
        <TextInput
          ref={textInputRef}
          style={[
            styles.codeInput,
            {
              color: colors.codeForeground,
              // backgroundColor: colors.codeBackground,
            },
          ]}
          value={code}
          onChangeText={setCode}
          multiline
          scrollEnabled={false}
          autoCapitalize="none"
          autoCorrect={false}
          spellCheck={false}
          returnKeyType="next"
          textAlignVertical="top"
          numberOfLines={lines.length}
        />
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header with navigation and action buttons */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.fileName, { color: colors.text }]}>
            {fileName}
          </Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.headerButton}>
            <Icon name="rotate-ccw" size={16} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Icon name="rotate-cw" size={16} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Icon name="refresh-cw" size={16} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Icon name="upload" size={16} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Show highlighted section banner if needed */}
      {renderHighlightedSection()}

      {/* Main code editor area */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 5 : 0}
      >
        <View style={styles.codeEditorContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <ScrollView
              showsVerticalScrollIndicator={true}
              contentContainerStyle={styles.scrollContentContainer}
            >
              <View style={styles.codeContent}>
                {renderLineNumbers()}
                {renderCodeWithHighlight()}
              </View>
            </ScrollView>
          </ScrollView>
        </View>
        {renderKeyButtons()}
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    paddingTop: Platform.OS === "ios" ? 45 : 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  fileName: {
    fontSize: 14,
    fontWeight: "500",
  },
  headerButtons: {
    flexDirection: "row",
  },
  headerButton: {
    padding: 8,
  },
  highlightedSectionContainer: {
    backgroundColor: "rgba(30, 144, 255, 0.1)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(30, 144, 255, 0.3)",
    padding: 8,
  },
  highlightedSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  highlightedSectionTitle: {
    fontSize: 12,
    color: "#1E90FF",
    fontWeight: "500",
  },
  highlightedSectionButtons: {
    flexDirection: "row",
  },
  highlightButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginLeft: 8,
  },
  highlightButtonText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  codeEditorContainer: {
    flex: 1,
  },
  codeScrollContainer: {
    flex: 1,
    width: "100%",
  },
  scrollContentContainer: {
    flexGrow: 1,
    flexDirection: "row",
    // width: "auto",
  },
  codeContent: {
    flexDirection: "row",
    padding: 12,
    minWidth: "100%",
    width: "auto",
    flexWrap: "nowrap",
  },
  lineNumbers: {
    marginRight: 12,
    alignItems: "flex-end",
  },
  lineNumberContainer: {
    height: 20,
    justifyContent: "center",
    paddingHorizontal: 4,
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
  highlightedLineNumber: {
    backgroundColor: "rgba(30, 144, 255, 0.6)",
  },
  lineNumber: {
    fontSize: 14,
    lineHeight: 20,
    color: "#606366",
    fontFamily: "monospace",
  },
  codeInputContainer: {
    flex: 1,
    position: "relative",
    width: "auto",
  },
  codeInput: {
    flex: 1,
    fontSize: 12,
    lineHeight: 20,
    fontFamily: "monospace",
    padding: 0,
    minHeight: 300,
    width: "100%",
  },
  highlightOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    backgroundColor: "rgba(30, 144, 255, 0.2)",
    zIndex: -1,
  },
  keyButtonsContainer: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#333",
    padding: 8,
    backgroundColor: "#1E1E1E",
  },
  keyButton: {
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 4,
    backgroundColor: "#333",
    minWidth: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  keyboardDismissButton: {
    backgroundColor: "#555",
    marginLeft: 12,
  },
  keyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});
export default CodeEditorScreen;
