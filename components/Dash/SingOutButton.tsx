import { Text, TouchableOpacity, View } from "react-native";
import React from "react";
import * as AuthSession from "expo-auth-session";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import { useQuery } from "@tanstack/react-query";
import { LogOut } from "lucide-react-native";

WebBrowser.maybeCompleteAuthSession();

const SingOutButton = () => {
  const { refetch } = useQuery({
    queryKey: ["fetchUser"],
  });

  const redirectUri = AuthSession.makeRedirectUri();

  const ssoUrl =
    "https://auth.ttssam.eu.org/signout?callbackUrl=" + redirectUri;

  const handleSSOLogout = async () => {
    const result = await WebBrowser.openAuthSessionAsync(
      ssoUrl,
      AuthSession.makeRedirectUri()
    );

    if (result.type === "success" && result.url) {
      await SecureStore.deleteItemAsync("accessToken");
      await refetch();
    }
  };

  return (
    <TouchableOpacity
      className="bg-zinc-800 py-2 px-3 rounded-xl w-44"
      onPress={handleSSOLogout}
    >
      <View className="flex flex-row space-x-2">
        <LogOut className="w-10 h-10 text-white" />
        <Text className="font-bold text-white">Sign Out</Text>
      </View>
    </TouchableOpacity>
  );
};

export default SingOutButton;
