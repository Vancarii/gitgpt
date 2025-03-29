"use client";
import { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { CompositeNavigationProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { DrawerNavigationProp } from "@react-navigation/drawer";
import { useTheme } from "../context/ThemeContext";
import InputBar from "../components/InputBar";
import type { RootStackParamList, DrawerParamList } from "../../App";
import { useGitHub } from "../context/GitHubContext";
import { usePopup } from "../context/PopupContext";
import { useAuth } from "../context/AuthContext";
import { Message } from "../types/ChatTypes";
import { sampleRepositories } from "../data/Repositories";
import { useChatHandlers } from "../handlers/ChatHandlers";
import { WelcomeScreen } from "../components/WelcomeScreen";
import { MessageComponent } from "../components/MessageComponent";

type HomeScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<RootStackParamList, "Home">,
  DrawerNavigationProp<DrawerParamList>
>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { colors } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const { isConnected } = useGitHub();
  const { showPopup } = usePopup();
  const { isLoggedIn } = useAuth();

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const {
    handleSend,
    handleRepositorySelect,
    handleImportRepository,
    handleViewFullCode,
    handleCopyCode,
    handleGitHubLogin,
    handleUnavailableFeature,
  } = useChatHandlers(
    navigation,
    setMessages,
    setIsLoading,
    scrollToBottom,
    sampleRepositories,
    isLoggedIn,
    showPopup,
    messages
  );

  const renderMessages = () => {
    if (messages.length === 0) {
      return (
        <WelcomeScreen
          textColor={colors.text}
          isConnected={isConnected}
          onUnavailableFeature={handleUnavailableFeature}
          onImportRepository={handleImportRepository}
          onGitHubLogin={handleGitHubLogin}
        />
      );
    }

    return (
      <View style={styles.messagesContainer}>
        {messages.map((message) => (
          <MessageComponent
            key={message.id}
            message={message}
            colors={colors}
            onCopy={handleCopyCode}
            onViewFullCode={handleViewFullCode}
            onSelectRepository={handleRepositorySelect}
          />
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
  messagesContainer: {
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
});

export default HomeScreen;
