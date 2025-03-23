"use client";

import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
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

const fullCode = `#include <iostream>
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
  const [acceptChanges, setAcceptChanges] = useState(false);

  const { fileName } = route.params;

  const renderLineNumbers = () => {
    const lines = fullCode.split("\n");
    return (
      <View style={styles.lineNumbers}>
        {lines.map((_, index) => (
          <Text key={index} style={styles.lineNumber}>
            {index + 1}
          </Text>
        ))}
      </View>
    );
  };

  const renderCode = () => {
    const lines = fullCode.split("\n");
    return (
      <View style={styles.codeLines}>
        {lines.map((line, index) => {
          // Simple syntax highlighting
          let styledLine = line;

          // Highlight keywords
          const keywords = [
            "class",
            "public",
            "void",
            "int",
            "using",
            "namespace",
            "vector",
            "queue",
            "bool",
            "true",
            "false",
            "while",
            "for",
            "if",
            "auto",
          ];
          keywords.forEach((keyword) => {
            const regex = new RegExp(`\\b${keyword}\\b`, "g");
            styledLine = styledLine.replace(
              regex,
              `<keyword>${keyword}</keyword>`
            );
          });

          // Highlight comments
          if (styledLine.includes("//")) {
            const parts = styledLine.split("//");
            styledLine = parts[0] + "<comment>//" + parts[1] + "</comment>";
          }

          // Highlight the addEdge function if it's in the highlighted section
          const isHighlighted = index >= 22 && index <= 26;

          return (
            <View
              key={index}
              style={[
                styles.codeLine,
                isHighlighted && { backgroundColor: "rgba(30, 144, 255, 0.2)" },
              ]}
            >
              <Text style={{ color: colors.codeForeground }}>
                {styledLine.split(/<(\w+)>(.*?)<\/\1>/g).map((part, i) => {
                  if (i % 3 === 1) {
                    // This is a tag name
                    return null;
                  } else if (i % 3 === 2) {
                    // This is content inside a tag
                    const tagName =
                      styledLine.split(/<(\w+)>(.*?)<\/\1>/g)[i - 1];
                    if (tagName === "keyword") {
                      return (
                        <Text key={i} style={{ color: "#CC7832" }}>
                          {part}
                        </Text>
                      );
                    } else if (tagName === "comment") {
                      return (
                        <Text key={i} style={{ color: "#808080" }}>
                          {part}
                        </Text>
                      );
                    }
                  }
                  return <Text key={i}>{part}</Text>;
                })}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.closeButton}
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
            <Icon name="rotate-ccw" size={20} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Icon name="rotate-cw" size={20} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Icon name="refresh-cw" size={20} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Icon name="upload" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.codeContainer} horizontal={true}>
        <ScrollView>
          <View style={styles.codeContent}>
            {renderLineNumbers()}
            {renderCode()}
          </View>
        </ScrollView>
      </ScrollView>

      <View style={styles.changesContainer}>
        <TouchableOpacity
          style={[
            styles.changesButton,
            { backgroundColor: acceptChanges ? "#4CAF50" : colors.primary },
          ]}
          onPress={() => setAcceptChanges(!acceptChanges)}
        >
          <Text style={styles.changesButtonText}>
            {acceptChanges ? "Accept Changes" : "Decline Changes"}
          </Text>
        </TouchableOpacity>
      </View>
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
  closeButton: {
    padding: 8,
    marginRight: 8,
  },
  fileName: {
    fontSize: 16,
    fontWeight: "500",
  },
  headerButtons: {
    flexDirection: "row",
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  codeContainer: {
    flex: 1,
  },
  codeContent: {
    flexDirection: "row",
    padding: 12,
  },
  lineNumbers: {
    marginRight: 12,
    alignItems: "flex-end",
  },
  lineNumber: {
    fontSize: 14,
    lineHeight: 20,
    color: "#606366",
    fontFamily: "monospace",
  },
  codeLines: {
    flex: 1,
  },
  codeLine: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "monospace",
    paddingVertical: 1,
  },
  changesContainer: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  changesButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  changesButtonText: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
});

export default CodeEditorScreen;
