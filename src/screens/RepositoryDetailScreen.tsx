"use client";

import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "../context/ThemeContext";
import CodeBlock from "../components/CodeBlock";
import InputBar from "../components/InputBar";
import type { RootStackParamList } from "../../App";

const sampleCode = `// Add an edge to the graph
void addEdge(int v, int w)
{
    adj[v].push_back(
        w);
}`;

const fullExplanation = [
  "graph.size() is the total number of vertices.",
  "We use boolean[] visited to track which vertices have already been visited",
];

type RepositoryDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  "RepositoryDetail"
>;
type RepositoryDetailScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "RepositoryDetail"
>;

const RepositoryDetailScreen = () => {
  const route = useRoute<RepositoryDetailScreenRouteProp>();
  const navigation = useNavigation<RepositoryDetailScreenNavigationProp>();
  const { colors } = useTheme();
  const [message, setMessage] = useState("");

  const { name } = route.params;

  const handleSend = (text: string) => {
    setMessage(text);
    if (text.includes("file1.py")) {
      navigation.navigate("CodeEditor", { fileName: "file1.py" });
    }
  };

  const handleCopyCode = () => {
    console.log("Code copied to clipboard");
    // Implement clipboard functionality
  };

  const handleShowFullCode = () => {
    navigation.navigate("CodeEditor", { fileName: "file1.py" });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.content}>
        <View style={styles.messageContainer}>
          <Text style={[styles.messageText, { color: colors.text }]}>
            Successfully connect to {name}!
          </Text>
        </View>

        <View style={styles.messageContainer}>
          <Text style={[styles.messageText, { color: colors.text }]}>
            What do you want me to do next?
          </Text>
        </View>

        {message ? (
          <View
            style={[
              styles.userMessageContainer,
              { backgroundColor: colors.primary },
            ]}
          >
            <Text style={[styles.messageText, { color: colors.text }]}>
              {message}
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.suggestionButton, { backgroundColor: colors.card }]}
            onPress={() =>
              handleSend("Please help me fix the problem in file1.py.")
            }
          >
            <Text style={[styles.suggestionText, { color: colors.text }]}>
              Please help me fix the problem in file1.py.
            </Text>
          </TouchableOpacity>
        )}

        {message && (
          <>
            <View style={styles.messageContainer}>
              <Text style={[styles.messageText, { color: colors.text }]}>
                Here are some suggestions in file1.py:
              </Text>
            </View>

            <CodeBlock
              code={sampleCode}
              onCopy={handleCopyCode}
              onShowFullCode={handleShowFullCode}
            />

            <View style={styles.explanationContainer}>
              <Text style={[styles.explanationTitle, { color: colors.text }]}>
                Explanation:
              </Text>
              {fullExplanation.map((item, index) => (
                <View key={index} style={styles.explanationItem}>
                  <Text style={[styles.bulletPoint, { color: colors.text }]}>
                    •
                  </Text>
                  <Text
                    style={[styles.explanationText, { color: colors.text }]}
                  >
                    {item}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <InputBar
          onSend={handleSend}
          placeholder={
            message
              ? "Ask anything"
              : "Please help me fix the problem in file1.py"
          }
        />
        <Text style={styles.disclaimer}>
          ChatGPT can make mistakes. Check important info.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    marginBottom: 16,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  suggestionButton: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  suggestionText: {
    fontSize: 16,
  },
  explanationContainer: {
    marginTop: 16,
  },
  explanationTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  explanationItem: {
    flexDirection: "row",
    marginBottom: 8,
  },
  bulletPoint: {
    marginRight: 8,
    fontSize: 16,
  },
  explanationText: {
    flex: 1,
    fontSize: 16,
  },
  inputContainer: {
    padding: 8,
  },
  disclaimer: {
    textAlign: "center",
    fontSize: 12,
    color: "#888",
    marginTop: 4,
    marginBottom: 8,
  },
});

export default RepositoryDetailScreen;
