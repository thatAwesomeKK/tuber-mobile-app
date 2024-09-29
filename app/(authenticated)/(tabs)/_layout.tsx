import { router, Tabs } from "expo-router";
import BottomTabBar from "../../../components/BottomTabBar";
import { Image, Text, TouchableOpacity } from "react-native";
import { Search } from "lucide-react-native";
import { useUserStore } from "../../../lib/store";

export default function TabLayout() {
  const { user } = useUserStore();
  return (
    <Tabs
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{
        headerStatusBarHeight: 0,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: "",
          headerLeft: () => (
            <TouchableOpacity className="flex flex-row items-center justify-center ml-4 space-x-1">
              <Image
                source={require("../../../assets/images/YT.png")}
                className="w-6 h-6"
                resizeMode="contain"
              />
              <Text className="text-xl font-pbold">Tuber</Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push("/(authenticated)/search")}
              className="flex flex-row items-center justify-center mr-4 space-x-1"
            >
              <Search size={20} className="text-black" />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="upload"
        options={{
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="dash"
        options={{
          headerTitle: `${
            user ? "Welcome " + user?.fullName : "You are missing something"
          }`,
        }}
      />
    </Tabs>
  );
}
