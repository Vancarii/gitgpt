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
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { ThemeProvider } from "./src/context/ThemeContext";
import { GitHubProvider } from "./src/context/GitHubContext";
import { AuthProvider } from "./src/context/AuthContext";
import HomeScreen from "./src/screens/HomeScreen";
import RepositoryListScreen from "./src/screens/RepositoryListScreen";
import RepositoryDetailScreen from "./src/screens/RepositoryDetailScreen";
import CodeEditorScreen from "./src/screens/CodeEditorScreen";
import IntegrationsScreen from "./src/screens/IntegrationsScreen";
import GitHubLoginScreen from "./src/screens/GitHubLoginScreen";
import LoginScreen from "./src/screens/LoginScreen";
import SidebarScreen from "./src/screens/SidebarScreen";
import { useAuth } from "./src/context/AuthContext";
import UserSettingsScreen from "./src/screens/UserSettingsScreen";

// Define the type for our route parameters
export type RootStackParamList = {
  Home: undefined;
  RepositoryList: undefined;
  RepositoryDetail: { id: string; name: string };
  CodeEditor: { fileName: string };
  Integrations: undefined;
  GitHubLogin: undefined;
  Login: undefined;
  UserSettings: undefined;
};

export type DrawerParamList = {
  MainStack: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();

// Main stack navigator containing all screens except the sidebar
const MainStackNavigator = () => {
  const { isLoggedIn } = useAuth();

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={({ navigation }) => ({
        headerStyle: {
          backgroundColor: "#1E1E1E",
        },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: {
          fontWeight: "500",
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
            <Icon name="menu" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        ),
        // Change the right button based on login status
        headerRight: () => (
          <TouchableOpacity
            onPress={() => {
              if (isLoggedIn) {
                console.log("New chat");
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
            backgroundColor: "#1E1E1E",
          },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: {
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
        name="Login"
        component={LoginScreen}
        options={({ navigation }) => ({
          title: "Login",
          headerStyle: {
            backgroundColor: "#1E1E1E",
          },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: {
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

  // Apply default font globally
  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.style = [
    Text.defaultProps.style,
    { fontFamily: "OPTIDanley-Medium" },
  ];

  TextInput.defaultProps = TextInput.defaultProps || {};
  TextInput.defaultProps.style = [
    TextInput.defaultProps.style,
    { fontFamily: "OPTIDanley-Medium" },
  ];

  return (
    <ThemeProvider>
      <GitHubProvider>
        <AuthProvider>
          <NavigationContainer>
            <StatusBar barStyle="light-content" backgroundColor="#1E1E1E" />
            <Drawer.Navigator
              initialRouteName="MainStack"
              drawerContent={(props) => <SidebarScreen {...props} />}
              screenOptions={{
                headerShown: false,
                drawerStyle: {
                  backgroundColor: "#1E1E1E",
                  width: 280,
                },
              }}
            >
              <Drawer.Screen
                name="MainStack"
                component={MainNavigatorWithAuth}
              />
            </Drawer.Navigator>
          </NavigationContainer>
        </AuthProvider>
      </GitHubProvider>
    </ThemeProvider>
  );
}
