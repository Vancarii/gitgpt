import { useEffect, useState } from "react";
import * as Font from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  View,
  Text,
  TextInput,
  Platform,
} from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import { ThemeProvider, useTheme } from "./src/context/ThemeContext";
import { GitHubProvider } from "./src/context/GitHubContext";
import { AuthProvider } from "./src/context/AuthContext";
import HomeScreen from "./src/screens/HomeScreen";
import CodeEditorScreen from "./src/screens/CodeEditorScreen";
import IntegrationsScreen from "./src/screens/IntegrationsScreen";
import GitHubLoginScreen from "./src/screens/GitHubLoginScreen";
import LoginScreen from "./src/screens/LoginScreen";
import SidebarScreen from "./src/screens/SidebarScreen";
import { useAuth } from "./src/context/AuthContext";
import UserSettingsScreen from "./src/screens/UserSettingsScreen";
import MobileSimulator from "./src/components/MobileSimulator";
import { PopupProvider } from "./src/context/PopupContext";
import WebLayout from "./src/components/WebLayout";
import CommitScreen from "./src/screens/CommitScreen";
import CommitConfirmScreen from "./src/screens/CommitConfirmScreen";

// Define the type for our route parameters
export type RootStackParamList = {
  Home: { resetMessages?: boolean } | undefined;
  RepositoryList: undefined;
  RepositoryDetail: { id: string; name: string };
  CodeEditor: { fileName: string };
  Integrations: undefined;
  GitHubLogin: undefined;
  Login: undefined;
  UserSettings: undefined;
  Commit: undefined;
  CommitConfirm: undefined; // Add CommitConfirm screen
};

export type DrawerParamList = {
  MainStack: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();

// Main stack navigator containing all screens except the sidebar
const MainStackNavigator = () => {
  const { isLoggedIn } = useAuth();
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={({ navigation }) => ({
        headerStyle: {
          backgroundColor: colors.background,
          boxShadow: "0px 5px 5px rgba(0, 0, 0, 0.3)",
          borderBottomWidth: 0,
        },
        headerTintColor: colors.text,
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontFamily: "OPTIDanley-Medium",
        },
        contentStyle: {
          backgroundColor: "#1E1E1E",
        },
        // Add a menu button to the header
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={{ marginLeft: 10 }}
          >
            <Icon name="menu" size={24} color={colors.text} />
          </TouchableOpacity>
        ),
        // Change the right button based on login status
        headerRight: () => (
          <TouchableOpacity
            onPress={() => {
              if (isLoggedIn) {
                navigation.navigate("Home", { resetMessages: true });
                // console.log("New chat");
              } else {
                navigation.navigate("Login");
              }
            }}
            style={{
              marginRight: 10,
              backgroundColor: isLoggedIn ? "#1E1E1E" : "#FFFFFF",
              paddingVertical: 6,
              paddingHorizontal: 12,
              borderRadius: 20,
            }}
          >
            {isLoggedIn ? (
              <Icon name="edit" size={20} color="#FFFFFF" />
            ) : (
              <Text
                style={{
                  color: "#1E1E1E",
                  fontWeight: "500",
                  fontSize: 14,
                  fontFamily: "OPTIDanley-Medium",
                }}
              >
                Log In
              </Text>
            )}
          </TouchableOpacity>
        ),
      })}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "GitGPT" }}
      />
      <Stack.Screen
        name="CodeEditor"
        component={CodeEditorScreen}
        options={({ route }) => ({
          title: route.params.fileName,
          headerShown: false,
        })}
      />
      <Stack.Screen
        name="Integrations"
        component={IntegrationsScreen}
        options={{ title: "Integrations", headerRight: () => <View></View> }}
      />
      <Stack.Screen
        name="GitHubLogin"
        component={GitHubLoginScreen}
        options={({ navigation }) => ({
          title: "GitHub Login",
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: "500",
            fontFamily: "OPTIDanley-Medium",
            color: colors.text,
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 10 }}
            >
              <Icon name="arrow-left" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          ),
          headerRight: () => <View></View>,
        })}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={({ navigation }) => ({
          title: "Login",
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: {
            color: colors.text,
            fontWeight: "500",
            fontFamily: "OPTIDanley-Medium",
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 10 }}
            >
              <Icon name="arrow-left" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          ),
          headerRight: () => <View></View>,
        })}
      />
      <Stack.Screen
        name="UserSettings"
        component={UserSettingsScreen}
        options={{
          title: "Settings",
          presentation: "modal",
          animation: "slide_from_bottom",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Commit"
        component={CommitScreen}
        options={{
          title: "Commit",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="CommitConfirm"
        component={CommitConfirmScreen}
        options={{
          title: "Commit Confirmation",
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

// Wrapper component to use context in MainStackNavigator
const MainNavigatorWithAuth = () => {
  const authContext = useAuth();
  return <MainStackNavigator />;
};

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Setup icon fonts for web
  useEffect(() => {
    if (Platform.OS === "web") {
      // Load vector icons on web
      const iconFontStyles = `
        @font-face {
          src: url(${require("@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Feather.ttf")});
          font-family: Feather;
        }
      `;

      // Create stylesheet
      const style = document.createElement("style");
      style.type = "text/css";
      if (style.sheet) {
        const sheet = style.sheet as CSSStyleSheet;
        sheet.insertRule(iconFontStyles, sheet.cssRules.length);
      } else {
        style.appendChild(document.createTextNode(iconFontStyles));
      }

      // Inject stylesheet
      document.head.appendChild(style);
    }
  }, []);

  // Add this useEffect hook in your App component to inject CSS for hiding scrollbars on web
  useEffect(() => {
    if (Platform.OS === "web") {
      // Create style for hiding scrollbars
      const hideScrollbarStyles = `
      /* Hide scrollbar for Chrome, Safari and Opera */
      *::-webkit-scrollbar {
        display: none;
      }
      
      /* Hide scrollbar for IE, Edge and Firefox */
      * {
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
      }
      
      /* Ensure body has no margin and fills viewport */
      body {
        margin: 0;
        padding: 0;
        overflow: hidden;
      }
    `;

      // Create stylesheet
      const scrollbarStyle = document.createElement("style");
      scrollbarStyle.type = "text/css";
      if (scrollbarStyle.sheet) {
        const sheet = scrollbarStyle.sheet as CSSStyleSheet;
        sheet.insertRule(hideScrollbarStyles, sheet.cssRules.length);
      } else {
        scrollbarStyle.appendChild(
          document.createTextNode(hideScrollbarStyles)
        );
      }

      // Inject stylesheet
      document.head.appendChild(scrollbarStyle);
    }
  }, []);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        "OPTIDanley-Medium": require("./assets/fonts/OPTIDanley-Medium.otf"),
      });
      setFontsLoaded(true);
    };

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#1E1E1E" />
      </View>
    );
  }

  const AppContent = () => (
    <ThemeProvider>
      <GitHubProvider>
        <AuthProvider>
          <PopupProvider>
            <NavigationContainer>
              <StatusBar barStyle="light-content" backgroundColor="#1E1E1E" />
              <Drawer.Navigator
                initialRouteName="MainStack"
                drawerContent={(props) => <SidebarScreen {...props} />}
                screenOptions={{
                  headerShown: false,
                  drawerStyle: {
                    backgroundColor: "#1E1E1E",
                    width: 250,
                  },
                }}
              >
                <Drawer.Screen
                  name="MainStack"
                  component={MainNavigatorWithAuth}
                />
              </Drawer.Navigator>
            </NavigationContainer>
          </PopupProvider>
        </AuthProvider>
      </GitHubProvider>
    </ThemeProvider>
  );

  // Conditionally wrap with mobile simulator on web
  return Platform.OS === "web" ? (
    <WebLayout>
      <MobileSimulator>
        <AppContent />
      </MobileSimulator>
    </WebLayout>
  ) : (
    <AppContent />
  );
}
