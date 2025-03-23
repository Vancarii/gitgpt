"use client";
import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  FlatList,
} from "react-native";
import {
  useNavigation,
  type CompositeNavigationProp,
} from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { DrawerNavigationProp } from "@react-navigation/drawer";
import { useTheme } from "../context/ThemeContext";
import ActionButton from "../components/ActionButton";
import InputBar from "../components/InputBar";
import RepositoryCard from "../components/RepositoryCard";
import CodeBlock from "../components/CodeBlock";
import type { RootStackParamList, DrawerParamList } from "../../App";

// import { OPENAI_API_KEY } from "@env";
import CustomText from "../components/CustomText";
import { useGitHub } from "../context/GitHubContext";
import { usePopup } from "../context/PopupContext";

type HomeScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<RootStackParamList, "Home">,
  DrawerNavigationProp<DrawerParamList>
>;

interface CodeSection {
  code: string;
  language?: string;
}

type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  // Optional properties for special message types
  type?: "repository-list" | "repository-detail" | "code-response";
  repositoryList?: Array<{ id: string; name: string }>;
  repositoryName?: string;
  codeSections?: CodeSection[];
};

// Sample repositories
const repositories = [
  { id: "1", name: "Repository 1" },
  { id: "2", name: "Repository 2" },
  { id: "3", name: "Repository 3" },
  { id: "4", name: "Repository 4" },
];

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { colors } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const { isConnected } = useGitHub();
  const { showPopup } = usePopup();

  // Use this function wherever you need to show the popup
  const handleUnavailableFeature = () => {
    showPopup({
      title: "We're sorry!",
      description: "This page is not available yet, please check back later",
      buttonText: "Close",
    });
  };

  // Function to extract code blocks from a string
  // Looks for code blocks in the triple back ticks
  const extractCodeBlocks = (
    text: string
  ): { content: string; codeSections: CodeSection[] } => {
    // Regex to match code blocks: ```language\ncode\n```
    const codeBlockRegex = /```([a-zA-Z]*)\n([\s\S]*?)```/g;

    let match;
    const codeSections: CodeSection[] = [];
    let lastIndex = 0;
    let newContent = "";

    while ((match = codeBlockRegex.exec(text)) !== null) {
      // Add text before the code block
      newContent += text.slice(lastIndex, match.index);

      // Add a placeholder for the code block
      newContent += `[CODE_BLOCK_${codeSections.length}]`;

      // Save the code block
      codeSections.push({
        language: match[1] || "text",
        code: match[2].trim(),
      });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    newContent += text.slice(lastIndex);

    return {
      content: newContent,
      codeSections,
    };
  };

  // Function to call OpenAI API
  const callOpenAI = async (userMessage: string) => {
    try {
      setIsLoading(true);

      // Skip actual API call if it's a repository-related command
      if (
        userMessage.toLowerCase().includes("import repository") ||
        userMessage.toLowerCase().includes("github")
      ) {
        // Add repository list as a response
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString() + "-assistant",
              content:
                "Sure thing! Here are your repositories, choose one to link to this chat:",
              role: "assistant",
              timestamp: new Date(),
              type: "repository-list",
              repositoryList: repositories,
            },
          ]);
          setIsLoading(false);
        }, 1000);
        return;
      }

      // Your API endpoint
      const response = await fetch(
        process.env.NODE_ENV === "development"
          ? "http://localhost:3001/api/chat"
          : "/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [
              ...messages
                .filter((msg) => !msg.type || msg.type === "code-response")
                .map((msg) => ({
                  role: msg.role,
                  content: msg.content,
                })),
              { role: "user", content: userMessage },
            ],
          }),
        }
      );

      const data = await response.json();

      if (data.choices && data.choices.length > 0) {
        const assistantResponse = data.choices[0].message.content;

        // Check if response contains code blocks
        const { content, codeSections } = extractCodeBlocks(assistantResponse);

        // Add the assistant's response to messages
        if (codeSections.length > 0) {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString() + "-assistant",
              content: content,
              role: "assistant",
              timestamp: new Date(),
              type: "code-response",
              codeSections: codeSections,
            },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString() + "-assistant",
              content: assistantResponse,
              role: "assistant",
              timestamp: new Date(),
            },
          ]);
        }
      } else {
        console.error("Unexpected API response:", data);
      }
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
    } finally {
      setIsLoading(false);
      // Scroll to bottom after message is added
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    // Add user message to the state
    const userMessage: Message = {
      id: Date.now().toString() + "-user",
      content: text,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Scroll to bottom after message is added
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Call OpenAI API
    await callOpenAI(text);
  };

  const handleRepositorySelect = (repo: { id: string; name: string }) => {
    // Add user selection message
    setMessages((prev) => [
      ...prev.filter((msg) => msg.type !== "repository-list"),
      {
        id: Date.now().toString() + "-user",
        content: `I want to use ${repo.name}`,
        role: "user",
        timestamp: new Date(),
      },
    ]);

    // Add a simulated response with repository details
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "-assistant",
          content: `Successfully connected to ${repo.name}! What do you want me to do next?`,
          role: "assistant",
          timestamp: new Date(),
          type: "repository-detail",
          repositoryName: repo.name,
        },
      ]);

      // Scroll to bottom after message is added
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 800);
  };

  const handleImportRepository = () => {
    // Directly add a message with repository list
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString() + "-user",
        content: "I want to import a repository",
        role: "user",
        timestamp: new Date(),
      },
      {
        id: Date.now().toString() + "-assistant",
        content:
          "Sure thing! Here are your repositories, choose one to link to this chat:",
        role: "assistant",
        timestamp: new Date(),
        type: "repository-list",
        repositoryList: repositories,
      },
    ]);

    // Scroll to bottom after messages are added
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleViewFullCode = (code: string) => {
    // Navigate to code editor screen with the code
    navigation.navigate("CodeEditor", {
      fileName: "file1.py",
    });
  };

  const handleCopyCode = () => {
    console.log("Code copied to clipboard");
    // Implement clipboard functionality
  };

  const renderRepositoryList = (message: Message) => {
    if (!message.repositoryList) return null;

    return (
      <View style={styles.specialContentContainer}>
        <FlatList
          data={message.repositoryList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RepositoryCard
              name={item.name}
              onPress={() => handleRepositorySelect(item)}
            />
          )}
          scrollEnabled={false}
          contentContainerStyle={styles.listContent}
        />
      </View>
    );
  };

  const renderRepositoryDetail = (message: Message) => {
    if (!message.repositoryName) return null;

    return (
      <View style={styles.specialContentContainer}>
        <Text style={[styles.repoConnectedText, { color: colors.text }]}>
          You can now ask questions about {message.repositoryName}.
        </Text>
      </View>
    );
  };

  const renderCodeResponse = (message: Message) => {
    if (!message.codeSections || message.codeSections.length === 0) return null;

    // Split the message content by code block placeholders
    const contentParts = message.content.split(/\[CODE_BLOCK_(\d+)\]/);

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
            // This is a code block placeholder, get the corresponding code
            const codeIndex = parseInt(part);
            const codeSection = message.codeSections?.[codeIndex];

            if (!codeSection) return null;

            return (
              <View key={`code-${index}`} style={styles.codeBlockContainer}>
                <CodeBlock
                  code={codeSection.code}
                  onCopy={handleCopyCode}
                  onShowFullCode={() => handleViewFullCode(codeSection.code)}
                />
              </View>
            );
          }
        })}
      </View>
    );
  };

  const renderMessages = () => {
    if (messages.length === 0) {
      return (
        <View style={styles.welcomeContainer}>
          <CustomText style={[styles.welcomeText, { color: colors.text }]}>
            Welcome, how can I help you today?
          </CustomText>

          <View style={styles.actionsContainer}>
            <ActionButton
              label="Create image"
              icon="image"
              onPress={handleUnavailableFeature}
              style={styles.actionButton}
            />

            <ActionButton
              label="Help me write"
              icon="edit-2"
              onPress={handleUnavailableFeature}
              style={styles.actionButton}
            />

            <ActionButton
              label="Brainstorm"
              icon="box"
              onPress={handleUnavailableFeature}
              style={styles.actionButton}
            />

            {isConnected && (
              <ActionButton
                label="Import Repository"
                icon="github"
                onPress={handleImportRepository}
                style={styles.importButton}
              />
            )}
          </View>
        </View>
      );
    }

    return (
      <View style={styles.messagesContainer}>
        {messages.map((message) => (
          <View key={message.id}>
            <View
              style={[
                styles.messageWrapper,
                message.role === "user"
                  ? styles.userMessage
                  : styles.assistantMessage,
              ]}
            >
              {message.type === "code-response" ? (
                renderCodeResponse(message)
              ) : (
                <Text style={[styles.messageText, { color: colors.text }]}>
                  {message.content}
                </Text>
              )}
            </View>

            {/* Render special content based on message type */}
            {message.role === "assistant" &&
              message.type === "repository-list" &&
              renderRepositoryList(message)}

            {message.role === "assistant" &&
              message.type === "repository-detail" &&
              renderRepositoryDetail(message)}
          </View>
        ))}

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 88 : 0}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.content}
          contentContainerStyle={
            messages.length === 0
              ? styles.emptyContentContainer
              : styles.contentContainer
          }
        >
          {renderMessages()}
        </ScrollView>

        <View style={styles.inputContainer}>
          <InputBar onSend={handleSend} disabled={isLoading} />
          <Text style={styles.disclaimer}>GitGPT can make mistakes.</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    padding: 16,
  },
  emptyContentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 16,
  },
  welcomeContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 40,
  },
  actionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: 16,
    width: "100%",
  },
  actionButton: {
    width: "48%",
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  importButton: {
    width: "48%",
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderRadius: 8,
    borderColor: "#1F6E6D",
    padding: 2,
  },
  messagesContainer: {
    width: "100%",
  },
  messageWrapper: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    maxWidth: "85%",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#444654",
  },
  assistantMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#343541",
  },
  messageTextContainer: {
    width: "100%",
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  codeBlockContainer: {
    marginVertical: 8,
    width: "100%",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
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
  specialContentContainer: {
    width: "100%",
    marginTop: -8,
    marginBottom: 16,
  },
  listContent: {
    paddingVertical: 8,
  },
  repoConnectedText: {
    fontSize: 14,
    fontStyle: "italic",
    marginTop: 8,
  },
});

export default HomeScreen;
