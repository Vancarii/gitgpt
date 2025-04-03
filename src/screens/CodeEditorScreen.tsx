"use client";

import { useState, useRef, useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Modal,
  StyleSheet,
  StyleProp,
  ViewStyle,
  FlatList,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useTheme } from "../context/ThemeContext";
import type { RootStackParamList } from "../../App";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  useNavigation,
  useRoute,
  useIsFocused,
  type RouteProp,
} from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import PopupModal from "../components/PopupModal";

// First, let's add a custom hook for hover effects on web
const useHover = () => {
  const [isHovered, setIsHovered] = useState(false);

  const onHoverIn = () => setIsHovered(true);
  const onHoverOut = () => setIsHovered(false);

  return { isHovered, onHoverIn, onHoverOut };
};

// Properly typed component for buttons with hover effect
interface HoverButtonProps {
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

const HoverButton = ({
  style,
  onPress,
  disabled = false,
  children,
}: HoverButtonProps) => {
  const { isHovered, onHoverIn, onHoverOut } = useHover();

  return (
    <TouchableOpacity
      style={[
        style,
        isHovered && Platform.OS === "web" && styles.buttonHovered,
        disabled && styles.buttonDisabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      {...(Platform.OS === "web"
        ? {
            // @ts-ignore - These are web-specific props
            onMouseEnter: onHoverIn,
            onMouseLeave: onHoverOut,
          }
        : {})}
    >
      {children}
    </TouchableOpacity>
  );
};

// Add navigation type
type CodeEditorScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "CodeEditor"
>;

// Define the route prop type
type CodeEditorScreenRouteProp = RouteProp<RootStackParamList, "CodeEditor">;
type CommitScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Commit"
>;
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

const guideTitle = "Welcome to Code Editor";
const guideDescription =
  "Here's how to use the Code Editor:\n\n" +
  "• Blue highlighted areas show suggested code changes\n" +
  "• Use Accept/Decline buttons to manage suggestions\n" +
  "• Tap on any line to edit it directly\n" +
  "• Use undo/redo buttons to track changes\n" +
  "• Click the clock icon to view code history\n" +
  "• Use the share button to commit or save changes\n\n" +
  "Happy coding!";

const CodeEditorScreen = () => {
  const route = useRoute<CodeEditorScreenRouteProp>();
  const navigation = useNavigation<CodeEditorScreenNavigationProp>();
  const { colors } = useTheme();
  const [code, setCode] = useState(initialCode);
  const [highlighted, setHighlighted] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);
  const textInputRef = useRef<TextInput>(null);
  const [codeHistory, setCodeHistory] = useState<string[]>([initialCode]); // For undo/redo
  const [historyIndex, setHistoryIndex] = useState(0);
  const [showShareDropdown, setShowShareDropdown] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const shareButtonRef =
    useRef<React.ElementRef<typeof TouchableOpacity>>(null);
  const [shareButtonPosition, setShareButtonPosition] = useState({
    top: 0,
    right: 0,
  });
  const [isModified, setIsModified] = useState(false);
  const [activeLineIndex, setActiveLineIndex] = useState(-1);
  const cursorPositionRef = useRef<number>(0);

  const [showGuide, setShowGuide] = useState(false);
  const isFocused = useIsFocused();
  const guideDismissedRef = useRef(false);

  useEffect(() => {
    const checkGuideStatus = async () => {
      try {
        // Check if the guide has been shown before
        const hasSeenGuide = await AsyncStorage.getItem(
          "hasSeenCodeEditorGuide"
        );
        if (hasSeenGuide !== "true" && isFocused) {
          setShowGuide(true);
          // Save that the guide has been shown
          await AsyncStorage.setItem("hasSeenCodeEditorGuide", "true");
        }
      } catch (error) {
        console.log("Error checking guide status:", error);
        // If there's an error accessing AsyncStorage, fall back to using the ref
        if (isFocused && !guideDismissedRef.current) {
          setShowGuide(true);
          guideDismissedRef.current = true;
        }
      }
    };

    checkGuideStatus();
  }, [isFocused]);

  // Define which lines to highlight (line numbers are 0-indexed in the array)
  const highlightStartLine = 17; // Line 22 (0-indexed)
  const highlightEndLine = 21; // Line 27 (0-indexed)

  const { fileName } = route.params;

  // Function to dismiss keyboard
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  // Insert special character at current cursor position
  const insertAtCursor = (char: string) => {
    if (activeLineIndex >= 0) {
      const lines = code.split("\n");
      const line = lines[activeLineIndex];

      // Insert the character at cursor position for the active line
      const newLine =
        line.substring(0, cursorPositionRef.current) +
        char +
        line.substring(cursorPositionRef.current);

      lines[activeLineIndex] = newLine;
      setCode(lines.join("\n"));
      setIsModified(true);

      // Update cursor position
      cursorPositionRef.current += char.length;

      // Re-focus the TextInput and set cursor position after render
      setTimeout(() => {
        if (textInputRef.current) {
          textInputRef.current.focus();

          // Try to handle cursor positioning - this is challenging in React Native
          // On web, we can try selection APIs
          if (Platform.OS === "web") {
            try {
              // @ts-ignore - This is web-specific code
              textInputRef.current.setSelectionRange(
                cursorPositionRef.current,
                cursorPositionRef.current
              );
            } catch (error) {
              console.log("Error setting cursor position:", error);
            }
          }
        }
      }, 10);
    }
  };

  useEffect(() => {
    if (showShareDropdown && shareButtonRef.current && Platform.OS === "web") {
      // @ts-ignore - This is web-specific code
      const rect = shareButtonRef.current.getBoundingClientRect();
      setShareButtonPosition({
        top: rect.bottom + window.scrollY - 40, // Add scroll position
        right: window.innerWidth - rect.right - 20,
      });
    }
  }, [showShareDropdown]);

  // Function to handle accepting changes
  const handleAcceptChanges = () => {
    // Save to history for undo
    setCodeHistory((prev) => [...prev.slice(0, historyIndex + 1), code]);
    setHistoryIndex((prev) => prev + 1);

    // Keep the code but remove highlighting
    setHighlighted(false);

    // Important: Keep isModified as true when accepting changes
    setIsModified(true);
  };

  // Function to handle declining changes
  const handleDeclineChanges = () => {
    // Save to history for undo
    setCodeHistory((prev) => [...prev.slice(0, historyIndex + 1), code]);
    setHistoryIndex((prev) => prev + 1);

    // Remove the highlighted code lines completely
    const lines = code.split("\n");
    const newLines = [
      ...lines.slice(0, highlightStartLine),
      ...lines.slice(highlightEndLine + 1),
    ];

    // Set the new code and remove highlight
    setCode(newLines.join("\n"));
    setHighlighted(false);

    // Only in decline case, we reset the modified state
    setIsModified(false);
  };

  // Undo the last action
  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1);
      setCode(codeHistory[historyIndex - 1]);
      // If we had removed highlighting, bring it back
      if (!highlighted) {
        setHighlighted(true);
      }
    }
  };

  // Redo the undone action
  const handleRedo = () => {
    if (historyIndex < codeHistory.length - 1) {
      setHistoryIndex((prev) => prev + 1);
      setCode(codeHistory[historyIndex + 1]);
    }
  };

  // Toggle share dropdown
  const toggleShareDropdown = () => {
    setShowShareDropdown((prev) => !prev);
  };

  // Toggle history modal
  const toggleHistoryModal = () => {
    setShowHistoryModal((prev) => !prev);
  };

  // Restore code from history
  const restoreFromHistory = (index: number) => {
    setCode(codeHistory[index]);
    setHistoryIndex(index);
    setShowHistoryModal(false);
  };

  // Handle share actions
  const handleShareAction = (action: string) => {
    // Close dropdown
    setShowShareDropdown(false);

    // Implement actions
    switch (action) {
      case "pushToMain":
        console.log("Pushing to main branch...");
        navigation.navigate("Commit");
        // Implement actual push logic
        break;
      case "pushToNewBranch":
        console.log("Pushing to new branch...");
        // Implement new branch push logic
        break;
      case "addToRepository":
        console.log("Adding file to repository...");
        // Implement file add logic
        break;
      case "revertChanges":
        console.log("Reverting all changes...");
        setCode(initialCode);
        setHighlighted(true);
        // Add to history
        setCodeHistory((prev) => [
          ...prev.slice(0, historyIndex + 1),
          initialCode,
        ]);
        setHistoryIndex((prev) => prev + 1);
        break;
    }
  };

  // Render highlighted section bars if highlighted state is true
  const renderHighlightedSection = () => {
    if (!highlighted) return null;

    return (
      <View style={styles.highlightedSectionContainer}>
        <View style={styles.highlightedSectionHeader}>
          <Text style={styles.highlightedSectionTitle}>
            Suggested code changes
          </Text>
          <View style={styles.highlightedSectionButtons}>
            <TouchableOpacity
              style={[styles.highlightButton, styles.acceptButton]}
              onPress={handleAcceptChanges}
            >
              <Icon
                name="check"
                size={16}
                color="#FFFFFF"
                style={styles.buttonIcon}
              />
              <Text style={styles.highlightButtonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.highlightButton, styles.declineButton]}
              onPress={handleDeclineChanges}
            >
              <Icon
                name="x"
                size={16}
                color="#FFFFFF"
                style={styles.buttonIcon}
              />
              <Text style={styles.highlightButtonText}>Decline</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  // Updated code for share dropdown to position correctly
  const renderShareDropdown = () => {
    if (!showShareDropdown) return null;

    return (
      <Modal
        transparent={true}
        visible={showShareDropdown}
        animationType="fade"
        onRequestClose={() => setShowShareDropdown(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowShareDropdown(false)}>
          <View style={styles.dropdownOverlay}>
            <View
              style={[
                styles.dropdownContainer,
                {
                  position: "absolute",
                  top: shareButtonPosition.top,
                  right: shareButtonPosition.right,
                  zIndex: 1000,
                },
              ]}
            >
              <HoverButton
                style={styles.dropdownItem}
                onPress={() => handleShareAction("pushToMain")}
              >
                <Icon name="git-branch" size={18} color={colors.text} />
                <Text style={[styles.dropdownText, { color: colors.text }]}>
                  Push to Main
                </Text>
              </HoverButton>

              <HoverButton
                style={styles.dropdownItem}
                onPress={() => handleShareAction("pushToNewBranch")}
              >
                <Icon name="git-merge" size={18} color={colors.text} />
                <Text style={[styles.dropdownText, { color: colors.text }]}>
                  Push to New Branch
                </Text>
              </HoverButton>

              <HoverButton
                style={styles.dropdownItem}
                onPress={() => handleShareAction("addToRepository")}
              >
                <Icon name="file-plus" size={18} color={colors.text} />
                <Text style={[styles.dropdownText, { color: colors.text }]}>
                  Add File to Repository
                </Text>
              </HoverButton>

              <View style={styles.dropdownDivider} />

              <HoverButton
                style={styles.dropdownItem}
                onPress={() => handleShareAction("revertChanges")}
              >
                <Icon name="refresh-ccw" size={18} color="#F44336" />
                <Text style={[styles.dropdownText, { color: "#F44336" }]}>
                  Revert All Changes
                </Text>
              </HoverButton>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  // History modal with fixed type for color
  const renderHistoryModal = () => {
    if (!showHistoryModal) return null;

    return (
      <Modal
        transparent={true}
        visible={showHistoryModal}
        animationType="fade"
        onRequestClose={() => setShowHistoryModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowHistoryModal(false)}>
          <View style={styles.historyOverlay}>
            <View style={styles.historyContainer}>
              <View style={styles.historyHeader}>
                <Text style={[styles.historyTitle, { color: colors.text }]}>
                  Edit History
                </Text>
                <HoverButton
                  style={styles.historyCloseButton}
                  onPress={() => setShowHistoryModal(false)}
                >
                  <Icon name="x" size={18} color={colors.text} />
                </HoverButton>
              </View>

              <FlatList
                data={codeHistory}
                keyExtractor={(_, index) => `history-${index}`}
                renderItem={({ item, index }) => (
                  <HoverButton
                    style={[
                      styles.historyItem,
                      index === historyIndex && styles.historyItemActive,
                    ]}
                    onPress={() => restoreFromHistory(index)}
                  >
                    <View style={styles.historyItemContent}>
                      <Text
                        style={[
                          styles.historyItemTitle,
                          { color: colors.text },
                        ]}
                      >
                        {index === 0 ? "Initial Code" : `Edit ${index}`}
                      </Text>
                      <Text
                        style={[
                          styles.historyItemPreview,
                          { color: colors.secondary },
                        ]}
                        numberOfLines={1}
                      >
                        {item.split("\n")[0].substring(0, 30)}...
                      </Text>
                    </View>
                    {index === historyIndex && (
                      <Icon name="check" size={16} color="#4CAF50" />
                    )}
                  </HoverButton>
                )}
                style={styles.historyList}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  // Updated header with file modification indicator
  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <HoverButton
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={20} color={colors.text} />
        </HoverButton>
        <View style={styles.fileNameContainer}>
          <Text style={[styles.fileName, { color: colors.text }]}>
            {fileName}
          </Text>
          {isModified && (
            <View style={styles.modifiedIconContainer}>
              <Text style={styles.modifiedIcon}>M</Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.headerButtons}>
        <HoverButton
          style={styles.headerButton}
          onPress={handleUndo}
          disabled={historyIndex === 0}
        >
          <Icon
            name="rotate-ccw"
            size={20}
            color={historyIndex === 0 ? colors.border : colors.text}
          />
        </HoverButton>
        <HoverButton
          style={styles.headerButton}
          onPress={handleRedo}
          disabled={historyIndex === codeHistory.length - 1}
        >
          <Icon
            name="rotate-cw"
            size={20}
            color={
              historyIndex === codeHistory.length - 1
                ? colors.border
                : colors.text
            }
          />
        </HoverButton>
        <HoverButton style={styles.headerButton} onPress={toggleHistoryModal}>
          <Icon name="clock" size={20} color={colors.text} />
        </HoverButton>
        {/* Use TouchableOpacity with ref for the share button */}
        <TouchableOpacity
          style={[
            styles.headerButton,
            Platform.OS === "web" && styles.webHeaderButton,
          ]}
          onPress={toggleShareDropdown}
          ref={shareButtonRef}
        >
          <Icon name="share-2" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Update key buttons to use HoverButton
  const renderKeyButtons = () => {
    const keys = ["{", "}", "(", ")", "[", "]", ";", "=", "+", "→"];

    return (
      <View style={styles.keyButtonsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {keys.map((key, index) => (
            <HoverButton
              key={index}
              style={styles.keyButton}
              onPress={() => insertAtCursor(key)}
            >
              <Text style={styles.keyButtonText}>{key}</Text>
            </HoverButton>
          ))}
          <HoverButton
            style={[styles.keyButton, styles.keyboardDismissButton]}
            onPress={dismissKeyboard}
          >
            <Icon name="chevron-down" size={20} color="#FFFFFF" />
          </HoverButton>
        </ScrollView>
      </View>
    );
  };

  const handleLineEdit = (lineIndex: number, newText: string) => {
    const lines = code.split("\n");

    // Only mark as modified if content actually changed
    if (lines[lineIndex] !== newText) {
      setIsModified(true);
    }

    lines[lineIndex] = newText;
    setCode(lines.join("\n"));
  };

  // Function to handle tab/shift for indentation (right shifting)
  const handleKeyPress = (e: React.KeyboardEvent, lineIndex: number) => {
    return false;
  };

  // Function to track cursor position
  const handleSelectionChange = (e: any, lineIndex: number) => {
    if (e.nativeEvent.selection) {
      cursorPositionRef.current = e.nativeEvent.selection.start;
      setActiveLineIndex(lineIndex);
    }
  };

  // Function to get color for syntax highlighting
  const getColorForToken = (token: string) => {
    // C++ keywords
    const keywords = [
      "class",
      "public",
      "private",
      "protected",
      "int",
      "bool",
      "void",
      "vector",
      "string",
      "queue",
      "using",
      "namespace",
      "auto",
      "for",
      "while",
      "if",
      "else",
      "return",
      "true",
      "false",
      "std",
      "cout",
      "include",
    ];

    // Types
    const types = ["int", "bool", "void", "string", "vector", "queue"];

    // Check token type
    if (token.startsWith("//")) {
      return "#6A9955"; // Comments - green
    } else if (token.startsWith('"') && token.endsWith('"')) {
      return "#CE9178"; // Strings - brownish
    } else if (keywords.includes(token)) {
      return "#569CD6"; // Keywords - blue
    } else if (types.includes(token)) {
      return "#4EC9B0"; // Types - teal
    } else if (token.match(/\d+/)) {
      return "#B5CEA8"; // Numbers - light green
    } else if (token.match(/[A-Z][a-zA-Z0-9_]*/)) {
      return "#C586C0"; // Classes/uppercase identifiers - purple
    }

    // Default text color
    return colors.codeForeground;
  };

  // Simple syntax highlighter function
  const renderHighlightedText = (text: string) => {
    // Split text by common delimiters while keeping them in the result
    const tokens = text.split(/([{}()[\];:=+\-*/<>!&|^%,.\s]+)/);

    return (
      <Text
        style={{ flexDirection: "row", fontFamily: "monospace", fontSize: 14 }}
      >
        {tokens.map((token: string, idx: number) => {
          // Skip empty tokens
          if (!token.trim()) {
            return (
              <Text
                key={idx}
                style={{
                  color: colors.codeForeground,
                  fontFamily: "monospace",
                  fontSize: 14,
                }}
              >
                {token}
              </Text>
            );
          }

          const color = getColorForToken(token);
          return (
            <Text
              key={idx}
              style={{ color, fontFamily: "monospace", fontSize: 14 }}
            >
              {token}
            </Text>
          );
        })}
      </Text>
    );
  };

  // Function to render the code with highlighted lines
  const renderCodeWithHighlight = () => {
    const lines = code.split("\n");

    return (
      <View style={styles.codeContentContainer}>
        {lines.map((line, index) => {
          // Determine if this line should be highlighted
          const isHighlighted =
            highlighted &&
            index >= highlightStartLine &&
            index <= highlightEndLine;

          return (
            <View key={index} style={styles.codeLine}>
              {/* Line number component */}
              <View
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

              {/* Code content for this line */}
              <View
                style={[
                  styles.codeTextContainer,
                  {
                    backgroundColor: isHighlighted
                      ? "rgba(30, 144, 255, 0.2)"
                      : "transparent",
                  },
                ]}
              >
                {activeLineIndex === index ? (
                  <TextInput
                    value={line}
                    onChangeText={(newText) => handleLineEdit(index, newText)}
                    style={[
                      styles.codeText,
                      {
                        color: colors.codeForeground,
                        fontFamily: "monospace",
                        fontSize: 14,
                      },
                    ]}
                    multiline={false}
                    autoCapitalize="none"
                    autoCorrect={false}
                    spellCheck={false}
                    autoComplete="off"
                    ref={textInputRef}
                    onSelectionChange={(e) => handleSelectionChange(e, index)}
                    //onKeyPress={(e) => handleKeyPress(e, index)}
                    onFocus={() => setActiveLineIndex(index)}
                  />
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      // Activate edit mode immediately
                      setActiveLineIndex(index);

                      // Focus the input after a slight delay to ensure it's in the DOM
                      setTimeout(() => {
                        if (textInputRef.current) {
                          textInputRef.current.focus();

                          // Set cursor to the end of the line initially
                          // cursorPositionRef.current = line.length;

                          try {
                            // @ts-ignore - This is web-specific code
                            textInputRef.current.setSelectionRange(
                              0,
                              line.length
                            );
                          } catch (error) {
                            console.log(
                              "Error setting selection range:",
                              error
                            );
                          }
                        }
                      }, 1);
                    }}
                    style={{ flex: 1 }}
                  >
                    {renderHighlightedText(line)}
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {renderHeader()}
      {renderHighlightedSection()}
      {renderShareDropdown()}
      {renderHistoryModal()}

      {/* Main code editor area - FIXED STRUCTURE for proper horizontal dragging */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 5 : 0}
      >
        <View style={styles.codeEditorContainer}>
          {/* The outer ScrollView is horizontal and contains ALL the code content */}
          <ScrollView
            ref={scrollViewRef}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ minWidth: "100%" }}
          >
            {/* This container ensures the code block stays together */}
            <View style={{ flexDirection: "row" }}>
              {/* The inner ScrollView handles vertical scrolling */}
              <ScrollView
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
              >
                {renderCodeWithHighlight()}
              </ScrollView>
            </View>
          </ScrollView>
        </View>
        {renderKeyButtons()}
      </KeyboardAvoidingView>

      <PopupModal
        visible={showGuide}
        onClose={() => {
          setShowGuide(false);
          // Additional safety - try to update AsyncStorage again
          AsyncStorage.setItem("hasSeenCodeEditorGuide", "true").catch(
            (err: unknown) => console.log("Error saving guide status:", err)
          );
        }}
        title={guideTitle}
        description={guideDescription}
        buttonText="Got it!"
      />
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
  fileNameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  fileName: {
    fontSize: 14,
    fontWeight: "500",
  },
  modifiedIconContainer: {
    marginLeft: 8,
    backgroundColor: "#FF8C00", // Dark orange color
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  modifiedIcon: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  headerButtons: {
    flexDirection: "row",
  },
  headerButton: {
    padding: 8,
  },
  webHeaderButton: {
    position: "relative",
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginLeft: 10,
    minWidth: 100,
  },
  acceptButton: {
    backgroundColor: "#4CAF50",
  },
  declineButton: {
    backgroundColor: "#F44336",
  },
  highlightButtonText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "600",
    marginLeft: 6,
  },
  buttonIcon: {
    marginRight: 4,
  },
  codeEditorContainer: {
    flex: 1,
    width: "100%", // Full width container
  },
  codeScrollContainer: {
    flex: 1,
    width: "100%",
  },
  scrollContentContainer: {
    flexGrow: 1,
    flexDirection: "row",
  },
  codeContent: {
    flexDirection: "row",
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
  codeText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "monospace",
    padding: 0,
    minHeight: 20,
  },
  codeTextContainer: {
    flex: 1,
    paddingVertical: 0,
    paddingHorizontal: 2,
    minHeight: 20,
    backgroundColor: "transparent",
  },
  codeContentContainer: {
    padding: 12,
    minWidth: "100%", // This ensures the code takes full width
    width: 2000, // This large fixed width ensures there's space for horizontal scrolling
  },
  codeLine: {
    flexDirection: "row",
    minHeight: 20,
    width: "100%", // Each line takes the full width of the container
  },
  dropdownOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  dropdownContainer: {
    backgroundColor: "#252525",
    borderRadius: 8,
    marginTop: 50,
    marginRight: 10,
    width: 220,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  dropdownText: {
    fontSize: 14,
    marginLeft: 12,
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: "#444",
    marginHorizontal: 8,
  },
  buttonHovered: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 4,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  historyOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  historyContainer: {
    backgroundColor: "#252525",
    borderRadius: 8,
    width: "80%",
    maxWidth: 500,
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#444",
    padding: 16,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  historyCloseButton: {
    padding: 8,
  },
  historyList: {
    maxHeight: 500,
  },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  historyItemActive: {
    backgroundColor: "rgba(30, 144, 255, 0.1)",
  },
  historyItemContent: {
    flex: 1,
  },
  historyItemTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  historyItemPreview: {
    fontSize: 12,
    opacity: 0.7,
  },
  onboardingOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  highlightArea: {
    position: "absolute",
    backgroundColor: "rgba(30, 144, 255, 0.3)",
    borderRadius: 8,
  },
  onboardingCard: {
    backgroundColor: "#252525",
    borderRadius: 8,
    padding: 16,
    width: "80%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  onboardingTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#FFFFFF",
  },
  onboardingMessage: {
    fontSize: 14,
    marginBottom: 16,
    color: "#CCCCCC",
  },
  onboardingNavigation: {
    flexDirection: "row",
    alignItems: "center",
  },
  onboardingButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    backgroundColor: "#1E90FF",
  },
  onboardingButtonText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  experienceCard: {
    backgroundColor: "#252525",
    borderRadius: 8,
    padding: 16,
    width: "80%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  experienceTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#FFFFFF",
  },
  experienceMessage: {
    fontSize: 14,
    marginBottom: 16,
    color: "#CCCCCC",
  },
  experienceButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  experienceButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    backgroundColor: "#1E90FF",
    marginHorizontal: 8,
    alignItems: "center",
  },
  experienceButtonText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  experienceButtonSubtext: {
    fontSize: 12,
    color: "#CCCCCC",
    marginTop: 4,
  },
  expertButton: {
    backgroundColor: "#4CAF50",
  },
});
export default CodeEditorScreen;
