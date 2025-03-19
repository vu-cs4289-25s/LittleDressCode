import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

export default function NewOutfit() {
  const router = useRouter();

  return (
    <View>
      <Text>Outfit Details Page</Text>
      <Button title="Go Back" onPress={() => router.back()} />
    </View>
  );
}