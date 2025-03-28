// filepath: /Users/yechengwang/Desktop/SFU/Spring2025/CMPT363/group-project/gitgpt/src/components/chat/MessageComponent.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import { Message } from "../types/ChatTypes";
import { RepositoryListComponent } from "./RepositoryListComponent";
import { RepositoryDetailComponent } from "./RepositoryDetailsComponent";
import { CodeResponseComponent } from "./CodeResponseComponent";

interface MessageComponentProps {
  message: Message;
  colors: any;
  onCopy: () => void;
  onViewFullCode: (code: string) => void;
  onSelectRepository: (repo: { id: string; name: string }) => void;
}

export const MessageComponent = ({
  message,
  colors,
  onCopy,
  onViewFullCode,
  onSelectRepository,
}: MessageComponentProps) => {
  const renderMessageContent = () => {
    if (message.type === "code-response" && message.codeSections) {
      return (
        <CodeResponseComponent
          content={message.content}
          codeSections={message.codeSections}
          colors={colors}
          onCopy={onCopy}
          onViewFullCode={onViewFullCode}
        />
      );
    } else {
      return (
        <Text
          style={[
            styles.messageText,
            { color: message.type === "error" ? "#FF5252" : colors.text },
          ]}
        >
          {message.type === "error" && (
            <Icon
              name="alert-circle"
              size={16}
              color="#FF5252"
              style={{ marginRight: 8 }}
            />
          )}
          {message.content}
        </Text>
      );
    }
  };

  return (
    <View key={message.id}>
      <View
        style={[
          styles.messageWrapper,
          message.role === "user"
            ? styles.userMessage
            : message.type === "error"
            ? styles.errorMessage
            : styles.assistantMessage,
        ]}
      >
        {renderMessageContent()}
      </View>

      {/* Render special content based on message type */}
      {message.role === "assistant" &&
        message.type === "repository-list" &&
        message.repositoryList && (
          <RepositoryListComponent
            repositories={message.repositoryList}
            onSelectRepository={onSelectRepository}
          />
        )}

      {message.role === "assistant" &&
        message.type === "repository-detail" &&
        message.repositoryName && (
          <RepositoryDetailComponent
            repositoryName={message.repositoryName}
            textColor={colors.text}
          />
        )}
    </View>
  );
};

const styles = StyleSheet.create({
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
  errorMessage: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255, 82, 82, 0.1)",
    borderLeftWidth: 4,
    borderLeftColor: "#FF5252",
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
});
