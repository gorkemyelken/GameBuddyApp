import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer, useNavigationState } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./pages/LoginScreen";
import RegisterScreen from "./pages/RegisterScreen";
import MatchScreen from "./pages/MatchScreen";
import HomeScreen from "./pages/HomeScreen";
import AddGameStatScreen from "./pages/AddGameStatScreen";
import MyProfileScreen from "./pages/MyProfileScreen";
import EditMyProfileScreen from "./pages/EditMyProfileScreen";
import FriendsScreen from "./pages/FriendsScreen";
import ChatScreen from "./pages/ChatScreen";
import Navbar from "./components/Navbar"; // Navbar'ı ekliyoruz
import { AuthProvider } from "./AuthContext";
import 'text-encoding-polyfill';
import 'react-native-get-random-values';

const Stack = createNativeStackNavigator();

export default function App() {
  const hiddenRoutes = [
    "LoginScreen",
    "RegisterScreen",
    "MatchScreen",
    "ChatScreen",
    "AddGameStatScreen",
    "EditMyProfileScreen",
  ];

  const NavBarConditional = () => {
    const state = useNavigationState((state) => state);
    const currentRoute = state?.routes[state.index]?.name;

    // Eğer currentRoute gizli sayfalardan birindeyse Navbar gösterilmeyecek
    return hiddenRoutes.includes(currentRoute) ? null : <Navbar />;
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="LoginScreen">
            <Stack.Screen
              name="LoginScreen"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="RegisterScreen"
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="MatchScreen" component={MatchScreen} />
            <Stack.Screen
              name="HomeScreen"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="MyProfileScreen"
              component={MyProfileScreen}
              options={{ headerBackVisible: false }}
            />
            <Stack.Screen name="AddGameStatScreen" component={AddGameStatScreen} />
            <Stack.Screen name="EditMyProfileScreen" component={EditMyProfileScreen} />
            <Stack.Screen name="FriendsScreen" component={FriendsScreen} />
            <Stack.Screen name="ChatScreen" component={ChatScreen} />
          </Stack.Navigator>
          {/* Navbar'ı sayfa altında, yalnızca belirli ekranlarda göstermek için */}
          <NavBarConditional />
        </NavigationContainer>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
