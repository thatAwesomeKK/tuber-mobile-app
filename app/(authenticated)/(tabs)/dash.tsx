import { Text, View } from "react-native";
import React from "react";
import { Avatar } from "react-native-paper";
import SingOutButton from "../../../components/Dash/SingOutButton";
import { useUserStore } from "../../../lib/store";
import SignInButton from "../../../components/Dash/SignInButton";
import VideoFeed from "../../../components/Dash/VideoFeed";

const Dashboard = () => {
  const { user } = useUserStore();
  return (
    <View className="flex-1 mx-6 mt-8">
      <View className="flex flex-row space-x-2 w-full">
        <Avatar.Image
          size={80}
          source={{
            uri: user?.pfp || "https://api.dicebear.com/9.x/micah/png",
          }}
        />
        <View className="flex justify-center">
          <Text className="text-black font-pbold capitalize">
            {user?.fullName || "anonymous"}
          </Text>
          {user ? <SingOutButton /> : <SignInButton />}
        </View>
      </View>
      <VideoFeed />
    </View>
  );
};

export default Dashboard;
