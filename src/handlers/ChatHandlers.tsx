import { useState } from "react";
import { type NavigationProp } from "@react-navigation/native";
import { type Message, type Repository } from "../types/ChatTypes";

export const useChatHandlers = (
  navigation: NavigationProp<any>,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  scrollToBottom: () => void,
  repositories: Repository[],
  isLoggedIn: boolean,
  showPopup: (options: any) => void,
  messages: Message[]
) => {
  const extractCodeBlocks = (
    text: string
  ): {
    content: string;
    codeSections: Array<{ code: string; language?: string }>;
  } => {
    const codeBlockRegex = /```([a-zA-Z]*)\n([\s\S]*?)```/g;

    let match;
    const codeSections: Array<{ code: string; language?: string }> = [];
    let lastIndex = 0;
    let newContent = "";

    while ((match = codeBlockRegex.exec(text)) !== null) {
      newContent += text.slice(lastIndex, match.index);
      newContent += `[CODE_BLOCK_${codeSections.length}]`;
      codeSections.push({
        language: match[1] || "text",
        code: match[2].trim(),
      });
      lastIndex = match.index + match[0].length;
    }

    newContent += text.slice(lastIndex);
    return { content: newContent, codeSections };
  };

  const callOpenAI = async (userMessage: string) => {
    try {
      setIsLoading(true);

      // Skip actual API call if it's a repository-related command
      if (
        userMessage.toLowerCase().includes("import repository") ||
        userMessage.toLowerCase().includes("github")
      ) {
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

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        // Create an array of messages without special types for the API
        const messagesForAPI = messages
          .filter((msg: Message) => !msg.type || msg.type === "code-response")
          .map((msg: Message) => ({
            role: msg.role,
            content: msg.content,
          }));

        // Make sure to use the correct API endpoint
        const response = await fetch(
          process.env.NODE_ENV === "development"
            ? "http://localhost:8081/api/chat" // Make sure this matches your server port
            : "/api/chat",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messages: [
                ...messagesForAPI,
                { role: "user", content: userMessage },
              ],
            }),
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`ServerError:${response.status}`);
        }

        const data = await response.json();

        if (data.choices && data.choices.length > 0) {
          const assistantResponse = data.choices[0].message.content;
          const { content, codeSections } =
            extractCodeBlocks(assistantResponse);

          setMessages((prev) => [
            ...prev,
            codeSections.length > 0
              ? {
                  id: Date.now().toString() + "-assistant",
                  content: content,
                  role: "assistant",
                  timestamp: new Date(),
                  type: "code-response",
                  codeSections: codeSections,
                }
              : {
                  id: Date.now().toString() + "-assistant",
                  content: assistantResponse,
                  role: "assistant",
                  timestamp: new Date(),
                },
          ]);
        } else {
          throw new Error("UnexpectedResponse");
        }
      } catch (error: unknown) {
        clearTimeout(timeoutId);

        // Handle network errors properly
        if (
          error instanceof Error &&
          (error.name === "AbortError" ||
            error.message === "Network request failed" ||
            error.message.includes("Failed to fetch") ||
            error.message.includes("Network Error"))
        ) {
          throw new Error("NetworkError");
        }
        throw error; // Re-throw other errors to be caught by the outer catch block
      }
    } catch (error: unknown) {
      console.error("Error calling OpenAI API:", error);

      let errorMessage =
        "Sorry, there was an error processing your request. Please check your internet connection and try again.";

      if (error instanceof Error) {
        if (
          error.name === "AbortError" ||
          error.message.includes("Failed to fetch") ||
          error.message === "Network request failed"
        ) {
          errorMessage =
            "Network error: Please check your internet connection and try again.";
        } else if (error.message.startsWith("ServerError:")) {
          const statusCode = error.message.split(":")[1];
          errorMessage = `Server error (${statusCode}): The server is currently unavailable. Please try again later.`;
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "-error",
          content: errorMessage,
          role: "assistant",
          timestamp: new Date(),
          type: "error",
        },
      ]);
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString() + "-user",
      content: text,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    scrollToBottom();
    await callOpenAI(text);
  };

  const handleRepositorySelect = (repo: { id: string; name: string }) => {
    setMessages((prev) => [
      ...prev.filter((msg) => msg.type !== "repository-list"),
      {
        id: Date.now().toString() + "-user",
        content: `I want to use ${repo.name}`,
        role: "user",
        timestamp: new Date(),
      },
    ]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "-assistant",
          content: `Successfully connected to ${repo.name}! What would you like me to do next?`,
          role: "assistant",
          timestamp: new Date(),
          type: "repository-detail",
          repositoryName: repo.name,
        },
      ]);
      scrollToBottom();
    }, 800);
  };

  const handleImportRepository = () => {
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
    scrollToBottom();
  };

  const handleViewFullCode = (code: string) => {
    navigation.navigate("CodeEditor", {
      fileName: "file1.py",
    });
  };

  const handleCopyCode = () => {
    console.log("Code copied to clipboard");
    // Implement clipboard functionality
  };

  const handleGitHubLogin = () => {
    if (!isLoggedIn) {
      showPopup({
        title: "Login Required",
        description:
          "Please log in to your account first before connecting to GitHub.",
        buttonText: "Close",
      });
      navigation.navigate("Login");
    } else {
      navigation.navigate("GitHubLogin");
    }
  };

  const handleUnavailableFeature = () => {
    showPopup({});
  };

  return {
    handleSend,
    handleRepositorySelect,
    handleImportRepository,
    handleViewFullCode,
    handleCopyCode,
    handleGitHubLogin,
    handleUnavailableFeature,
    extractCodeBlocks,
    callOpenAI,
  };
};
