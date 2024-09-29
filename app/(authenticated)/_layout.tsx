import { Link, Stack } from "expo-router";
import { CircleArrowLeft } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";
import SearchForm from "../../components/Search/SearchForm";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="upload/[id]"
        options={{
          presentation: "modal",
          headerShown: true,
          headerTitle: "",
          header: () => (
            <View className="h-16 bg-white flex items-start justify-center pl-4">
              <Link href={"/(tabs)/dash"} asChild>
                <TouchableOpacity>
                  <CircleArrowLeft size={35} className="text-black" />
                </TouchableOpacity>
              </Link>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="update/[id]"
        options={{
          presentation: "modal",
          headerShown: true,
          headerTitle: "",
          header: () => (
            <View className="h-16 bg-white flex items-start justify-center pl-4">
              <Link href={"/(tabs)/dash"} asChild>
                <TouchableOpacity>
                  <CircleArrowLeft size={35} className="text-black" />
                </TouchableOpacity>
              </Link>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="search"
        options={{
          presentation: "modal",
          headerShown: true,
          headerTitle: "",
          header: () => (
            <View className="h-20 bg-white flex items-start justify-center px-3">
              <SearchForm />
            </View>
          ),
        }}
      />
    </Stack>
  );
}
