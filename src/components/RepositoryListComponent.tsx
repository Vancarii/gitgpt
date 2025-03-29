import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Repository } from "../types/ChatTypes";
import RepositoryCard from "./RepositoryCard";

interface RepositoryListComponentProps {
  repositories: Repository[];
  onSelectRepository: (repo: { id: string; name: string }) => void;
}

export const RepositoryListComponent = ({
  repositories,
  onSelectRepository,
}: RepositoryListComponentProps) => {
  return (
    <View style={styles.specialContentContainer}>
      <FlatList
        data={repositories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RepositoryCard
            name={item.name}
            language={item.language}
            stars={item.stars}
            forks={item.forks}
            description={item.description}
            isPrivate={item.isPrivate}
            onPress={() => onSelectRepository(item)}
          />
        )}
        scrollEnabled={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  specialContentContainer: {
    width: "100%",
    marginTop: -8,
    marginBottom: 16,
  },
  listContent: {
    paddingVertical: 8,
  },
});
