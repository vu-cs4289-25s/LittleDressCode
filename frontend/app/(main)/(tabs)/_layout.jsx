import { Tabs } from "expo-router";
import { Platform } from "react-native";
import theme from "../../../styles/theme"; // Adjust path if needed
import {
  FontAwesome,
  Entypo,
  MaterialIcons,
  FontAwesome6,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.icons.medium,
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: 90,
          },
          default: {
            flexDirection: "row",
            alignItems: "center",
            height: 90,
          },
        }),
        tabBarIconStyle: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: 35,
        },
      }}
    >
      <Tabs.Screen
        name="outfits"
        options={{
          title: "Outfits",
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="shirt" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="closet"
        options={{
          title: "Closet",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="wardrobe" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Entypo name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="collections"
        options={{
          title: "Collections",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="dashboard" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
