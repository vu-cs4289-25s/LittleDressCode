import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { HapticTab } from "../../../components/HapticTab";
import { useColorScheme } from "../../../hooks/useColorScheme";
import theme from "../../../styles/theme";
import {
  FontAwesome,
  Entypo,
  MaterialIcons,
  FontAwesome6,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

export default function TabLayout() {
  // Themed colors for navigation:
  const colorScheme = useColorScheme();
  const currentLocation = colorScheme === "dark";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: currentLocation
          ? theme.colors.icons.medium
          : theme.colors.icons.dark,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
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
