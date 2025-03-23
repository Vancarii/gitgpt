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
import HomeScreen from "./src/screens/HomeScreen";
import RepositoryListScreen from "./src/screens/RepositoryListScreen";
import RepositoryDetailScreen from "./src/screens/RepositoryDetailScreen";
import CodeEditorScreen from "./src/screens/CodeEditorScreen";
import IntegrationsScreen from "./src/screens/IntegrationsScreen";
import SidebarScreen from "./src/screens/SidebarScreen";

// Define the type for our route parameters
export type RootStackParamList = {
  Home: undefined;
  RepositoryList: undefined;
  RepositoryDetail: { id: string; name: string };
  CodeEditor: { fileName: string };
  Integrations: undefined;
};

export type DrawerParamList = {
  MainStack: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();

// Main stack navigator containing all screens except the sidebar
const MainStackNavigator = () => {
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
        // Add a new chat button to the header
        headerRight: () => (
          <TouchableOpacity
            onPress={() => console.log("New chat")}
            style={{ marginRight: 10 }}
          >
            <Icon name="plus-square" size={22} color="#FFFFFF" />
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
        options={{ title: "Integrations" }}
      />
    </Stack.Navigator>
  );
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
          <Drawer.Screen name="MainStack" component={MainStackNavigator} />
        </Drawer.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
