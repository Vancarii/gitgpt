import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface RepositoryDetailComponentProps {
  repositoryName: string;
  textColor: string;
}

export const RepositoryDetailComponent = ({
  repositoryName,
  textColor,
}: RepositoryDetailComponentProps) => {
  return (
    <View style={styles.specialContentContainer}>
      <Text style={[styles.repoConnectedText, { color: textColor }]}>
        You can now ask questions about any file in {repositoryName}.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  specialContentContainer: {
    width: "100%",
    marginTop: -8,
    marginBottom: 16,
  },
  repoConnectedText: {
    fontSize: 14,
    fontStyle: "italic",
    marginTop: 8,
  },
});
