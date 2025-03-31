import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Platform,
    Modal,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useTheme } from "../context/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../App";
import { StyleProp, ViewStyle } from "react-native";

type CommitScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "Commit"
>;

const useHover = () => {
    const [isHovered, setIsHovered] = useState(false);

    const onHoverIn = () => setIsHovered(true);
    const onHoverOut = () => setIsHovered(false);

    return { isHovered, onHoverIn, onHoverOut };
};

interface HoverButtonProps {
    style?: StyleProp<ViewStyle>;
    onPress: () => void;
    disabled?: boolean;
    children: React.ReactNode;
}
const HoverButton = ({ style, onPress, disabled = false, children }: HoverButtonProps) => {
    const { isHovered, onHoverIn, onHoverOut } = useHover();

    return (
        <TouchableOpacity
            style={[
                style,
                isHovered && Platform.OS === 'web' && styles.buttonHovered,
                disabled && styles.buttonDisabled
            ]}
            onPress={onPress}
            disabled={disabled}
            {...(Platform.OS === 'web' ? {
                // @ts-ignore - These are web-specific props
                onMouseEnter: onHoverIn,
                onMouseLeave: onHoverOut
            } : {})}
        >
            {children}
        </TouchableOpacity>
    );
};

const CommitScreen = () => {
    const navigation = useNavigation<CommitScreenNavigationProp>();
    const { colors } = useTheme();
    const [commitMessage, setCommitMessage] = useState("Added addEdge Function to BFS");
    const [showConfirmation, setShowConfirmation] = useState(false);

    // The code that was changed
    const changedCode = `    // Add an edge to the graph
    void addEdge(int v, int w)
    {
        adj[v].push_back(w);
    }`;

    const handleCommit = () => {
        // Show confirmation dialog
        setShowConfirmation(true);
    };

    const confirmCommit = () => {
        // Here you would implement the actual commit functionality
        console.log("Committing changes with message:", commitMessage);
        // Navigate to confirmation screen
        setShowConfirmation(false);
        navigation.navigate("CommitConfirm");
    };

    // Confirmation popup in iOS style
    const renderConfirmationPopup = () => {
        return (
            <Modal
                transparent={true}
                visible={showConfirmation}
                animationType="fade"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Confirm Commit</Text>
                        <Text style={styles.modalMessage}>
                            Are you sure you want to commit changes to your GitHub Repository?
                        </Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setShowConfirmation(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <View style={styles.buttonDivider} />
                            <TouchableOpacity
                                style={[styles.modalButton, styles.confirmButton]}
                                onPress={confirmCommit}
                            >
                                <Text style={styles.confirmButtonText}>Commit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header with back button and GitHub icon */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-left" size={24} color={colors.text} />
                </TouchableOpacity>
                
                <View style={styles.headerIconContainer}>
                    <Icon name="github" size={24} color={colors.text} />
                </View>
                
                <View style={styles.placeholder} />
            </View>

            {/* Title section with separator */}
            <View style={styles.titleContainer}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>
                    Review Change
                </Text>
                <View/>
            </View>

            <ScrollView style={styles.contentContainer}>
                {/* Changed file section */}
                <View style={[styles.fileContainer, { borderColor: colors.border }]}>
                    <View style={styles.fileHeader}>
                        <Icon name="file-text" size={16} color={colors.text} />
                        <Text style={[styles.fileName, { color: colors.text }]}>
                            File1.py
                        </Text>
                    </View>

                    <View style={[
                        styles.codeContainer,
                        {
                            backgroundColor: colors.background,
                            borderWidth: 1,
                            borderColor: colors.border,
                            borderRadius: 4
                        }
                    ]}>
                        {changedCode.split('\n').map((line, index) => (
                            <View key={index} style={styles.codeLine}>
                                <Text style={[styles.lineNumber, { color: "white" }]}>
                                    {index + 1}
                                </Text>
                                <Text style={[styles.codeText, { color: colors.text }]}>
                                    {line}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Commit message section */}
                <View style={[styles.commitContainer, { borderColor: colors.border }]}>
                    <Text style={[styles.commitLabel, { color: colors.text }]}>
                        Commit Message
                    </Text>

                    <TextInput
                        style={[
                            styles.commitInput,
                            {
                                color: colors.text,
                                backgroundColor: colors.inputBackground,
                                borderColor: colors.border
                            }
                        ]}
                        value={commitMessage}
                        onChangeText={setCommitMessage}
                        multiline
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="Enter commit message..."
                        placeholderTextColor={colors.secondary}
                    />

                    <HoverButton
                        style={[styles.commitButton, { backgroundColor: "#4CAF50" }]}
                        onPress={handleCommit}
                    >
                        <Text style={styles.commitButtonText}>Commit Changes</Text>
                    </HoverButton>
                </View>
            </ScrollView>

            {/* Confirmation Popup */}
            {renderConfirmationPopup()}
        </View>
    );
};

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        paddingTop: Platform.OS === "ios" ? 50 : 16,
        borderBottomWidth: 1,
        borderBottomColor: "#333",
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "600",
    },
    placeholder: {
        width: 40, // Same width as back button to center the title
    },
    headerIconContainer: {
        alignItems: "center",
        justifyContent: "center",
    },
    titleContainer: {
        alignItems: "center",
        marginVertical: 20,
    },
    titleSeparator: {
        height: 1,
        width: "80%",
        marginTop: 8,
    },
    contentContainer: {
        flex: 1,
        padding: 16,
    },
    fileContainer: {
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 24,
        overflow: "hidden",
    },
    fileHeader: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#333",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
    },
    fileName: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: "500",
    },
    codeContainer: {
        padding: 12,
    },
    codeLine: {
        flexDirection: "row",
        minHeight: 24,
    },
    lineNumber: {
        width: 30,
        textAlign: "right",
        marginRight: 12,
        fontSize: 14,
        fontFamily: "monospace",
        opacity: 0.6,
    },
    codeText: {
        flex: 1,
        fontSize: 14,
        fontFamily: "monospace",
    },
    commitContainer: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 16,
        marginBottom: 30,
    },
    commitLabel: {
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 12,
    },
    commitInput: {
        borderWidth: 1,
        borderRadius: 6,
        padding: 12,
        fontSize: 14,
        minHeight: 100,
        textAlignVertical: "top",
        marginBottom: 16,
    },
    commitButton: {
        padding: 14,
        borderRadius: 6,
        alignItems: "center",
    },
    commitButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
    // Modal styles for iOS
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: Platform.OS === 'web' ? '70%' : '85%', // Wider on mobile
        maxWidth: 320, // Limit max width for mobile
        backgroundColor: Platform.OS === 'ios' ? '#F9F9F9' : '#242424', // Different bg for iOS vs Android
        borderRadius: 13,
        overflow: 'hidden',
        // Add shadow for better visibility
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    modalTitle: {
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 17,
        padding: 16,
        paddingBottom: 10,
        color: Platform.OS === 'ios' ? '#000' : '#FFF',
    },
    modalMessage: {
        textAlign: 'center',
        fontSize: 13,
        color: Platform.OS === 'ios' ? '#666' : '#CCC',
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    modalButtons: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#DDD',
    },
    modalButton: {
        flex: 1,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonDivider: {
        width: 1,
        backgroundColor: '#DDD',
    },
    cancelButton: {
        backgroundColor: 'transparent',
    },
    cancelButtonText: {
        color: '#FF3B30',
        fontWeight: '600',
        fontSize: 17,
    },
    confirmButton: {
        backgroundColor: 'transparent',
    },
    confirmButtonText: {
        color: '#007AFF',
        fontWeight: '600',
        fontSize: 17,
    },
    modalContentAndroid: {
        width: '80%',
        backgroundColor: '#FFF',
        borderRadius: 8,
        padding: 20,
        elevation: 5,
    },
    modalButtonsAndroid: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 20,
    },
    modalButtonAndroid: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginLeft: 8,
        borderRadius: 4,
    },
    cancelButtonAndroid: {
        backgroundColor: '#FF3B30',
    },
    confirmButtonAndroid: {
        backgroundColor: '#007AFF',
    },
    buttonHovered: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 4,
    },
    buttonDisabled: {
        opacity: 0.5,
    },

      
});

export default CommitScreen;