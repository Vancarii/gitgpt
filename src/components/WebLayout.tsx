import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import CollapsibleSection from "./CollapsibleSection";

interface WebLayoutProps {
  children: React.ReactNode;
}

const WebLayout: React.FC<WebLayoutProps> = ({ children }) => {
  // Only render the web layout on web platform
  if (Platform.OS !== "web") {
    return <>{children}</>;
  }

  const openLink = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.documentationPanel}>
        <View style={styles.documentationContent}>
          <Text style={styles.projectTitle}>GitGPT</Text>
          <Text style={styles.projectTagline}>
            AI-powered coding assistant for GitHub repositories
          </Text>
          <Text style={styles.paragraph}>
            CMPT 363 Group Project - Simon Fraser University - Spring 2025{"\n"}
          </Text>
          <Text style={styles.names}>
            Yecheng Wang, Tianxi Huang, Yvan Zhang, Albert Zhang{"\n"}
          </Text>

          {/* Add buttons for GitHub and YouTube links */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => openLink("https://github.com/Vancarii/gitgpt")}
            >
              <Icon
                name="github"
                size={16}
                color="#FFFFFF"
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>GitHub Repository</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() =>
                openLink("https://www.youtube.com/watch?v=29bj9o4lrWU")
              }
            >
              <Icon
                name="video"
                size={16}
                color="#FFFFFF"
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>Video Demo</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.paragraph}>
              GitGPT is a mobile application that combines the power of GitHub
              and OpenAI to help developers manage, understand, and improve
              their code more efficiently while on the go.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Features</Text>
            <View style={styles.featureList}>
              <View style={styles.featureItem}>
                <Icon
                  name="github"
                  size={20}
                  color="#FFF"
                  style={styles.featureIcon}
                />
                <Text style={styles.featureText}>GitHub Integration</Text>
              </View>
              <View style={styles.featureItem}>
                <Icon
                  name="code"
                  size={20}
                  color="#FFF"
                  style={styles.featureIcon}
                />
                <Text style={styles.featureText}>Repository Context</Text>
              </View>
              <View style={styles.featureItem}>
                <Icon
                  name="edit-2"
                  size={20}
                  color="#FFF"
                  style={styles.featureIcon}
                />
                <Text style={styles.featureText}>
                  Intuitive Code Editing Interface
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Icon
                  name="message-square"
                  size={20}
                  color="#FFF"
                  style={styles.featureIcon}
                />
                <Text style={styles.featureText}>
                  AI-Powered Code Suggestions
                </Text>
              </View>
            </View>
          </View>

          {/* <CollapsibleSection title="README">
            <Text style={styles.paragraph}></Text>
          </CollapsibleSection> */}

          {/* <CollapsibleSection title="Setup Instructions">
            <Text style={styles.paragraph}>
              1. Clone the repository:{"\n\n"}
              <Text style={styles.code}>
                git clone https://github.com/Vancarii/gitgpt.git
              </Text>
              {"\n\n"}
              2. Navigate to the project directory:{"\n\n"}
              <Text style={styles.code}>cd gitgpt</Text>
              {"\n\n"}
              3. Install dependencies:{"\n\n"}
              <Text style={styles.code}>npm install --legacy-peer-deps</Text>
              {"\n\n"}
              4. Setup Server{"\n\n"}
              <Text style={styles.code}>cd server{"\n\n"}npm install</Text>
              {"\n\n"}
              4. Set up environment variables:{"\n\n"}
              <Text style={styles.code}>
                # Create a .env file in the server directory{"\n\n"}
                touch server/.env{"\n\n"}# Add your OpenAI API key{"\n\n"}
                echo "OPENAI_API_KEY=your_api_key_here" {">"} server/.env
              </Text>
              {"\n\n"}
              5. Run the project:{"\n\n"}
              <Text style={styles.code}>
                npm run web # For web version{"\n\n"} npm start # For mobile
                version with Expo Go
              </Text>
            </Text>
          </CollapsibleSection> */}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Technology Stack</Text>
            <Text style={styles.paragraph}>
              • React Native / Expo Go{"\n"}• OpenAI API{"\n"}• Node.js{"\n"}
            </Text>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              © 2025 GitGPT - CMPT 363 Group Project
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.simulatorContainer}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    // height: "100vh",
    backgroundColor: "#121212",
  },
  documentationPanel: {
    width: "45%",
    height: "100%",
    backgroundColor: "#1E1E1E",
    padding: 40,
    overflow: "scroll",
  },
  documentationContent: {
    maxWidth: 600,
    marginLeft: "auto",
    marginRight: 20,
  },
  simulatorContainer: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  projectTitle: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
    fontFamily: "OPTIDanley-Medium",
  },
  projectTagline: {
    fontSize: 20,
    color: "#1F6E6D",
    marginBottom: 20,
    fontFamily: "OPTIDanley-Medium",
  },
  names: {
    fontSize: 14,
    lineHeight: 24,
    marginTop: 10,
    marginBottom: 10,
    color: "#CCCCCC",
    fontFamily: "OPTIDanley-Medium",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 20,
    marginBottom: 20,
  },
  linkButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#444654",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginRight: 10,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontFamily: "OPTIDanley-Medium",
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 24,
    color: "#FFFFFF",
    marginBottom: 15,
    fontFamily: "OPTIDanley-Medium",
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: "#CCCCCC",
    fontFamily: "OPTIDanley-Medium",
  },
  featureList: {
    marginTop: 10,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  featureIcon: {
    marginRight: 10,
  },
  featureText: {
    fontSize: 16,
    color: "#CCCCCC",
    fontFamily: "OPTIDanley-Medium",
  },
  footer: {
    marginTop: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  footerText: {
    fontSize: 14,
    color: "#666666",
    fontFamily: "OPTIDanley-Medium",
  },

  code: {
    fontFamily: "monospace",
    fontSize: 14,
    color: "#E6E6E6",
    backgroundColor: "#343434",
    padding: 12,
    borderRadius: 4,
    // marginTop: 50,
    // marginVertical: 20,
  },
});

export default WebLayout;
