"use client";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "../context/ThemeContext";
import RepositoryCard from "../components/RepositoryCard";
import InputBar from "../components/InputBar";
import type { RootStackParamList } from "../../App";

const repositories = [
  { id: "1", name: "Repository 1" },
  { id: "2", name: "Repository 2" },
  { id: "3", name: "Repository 3" },
  { id: "4", name: "Repository 4" },
];

type RepositoryListScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "RepositoryList"
>;

const RepositoryListScreen = () => {
  const navigation = useNavigation<RepositoryListScreenNavigationProp>();
  const { colors } = useTheme();

  const handleRepositoryPress = (repo: { id: string; name: string }) => {
    navigation.navigate("RepositoryDetail", { id: repo.id, name: repo.name });
  };

  const handleSend = (text: string) => {
    console.log("Message sent:", text);
    // Handle message logic here
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerContainer}>
        <Text style={[styles.headerText, { color: colors.text }]}>
          Sure thing! Here are your repositories, choose one to link to this
          chat:
        </Text>
      </View>

      <FlatList
        data={repositories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RepositoryCard
            name={item.name}
            onPress={() => handleRepositoryPress(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.paginationContainer}>
        <View
          style={[styles.paginationControls, { backgroundColor: colors.card }]}
        >
          <Text style={[styles.paginationText, { color: colors.text }]}>
            1/10
          </Text>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <InputBar onSend={handleSend} />
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
  headerContainer: {
    padding: 16,
  },
  headerText: {
    fontSize: 16,
    lineHeight: 22,
  },
  listContent: {
    paddingVertical: 8,
  },
  paginationContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  paginationControls: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  paginationText: {
    fontSize: 14,
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

export default RepositoryListScreen;
