import { Button, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import * as SecureStore from "expo-secure-store";
import { LogIn } from "lucide-react-native";

WebBrowser.maybeCompleteAuthSession();

const SignInButton = () => {
  const { refetch } = useQuery({
    queryKey: ["fetchUser"],
  });

  const { refetch: refetchUserVids } = useQuery({
    queryKey: ["fetchUserVids"],
  });

  const [token, setToken] = useState<string | null>(null);
  const ssoUrl =
    "https://auth.ttssam.eu.org/signin?callbackUrl=" +
    AuthSession.makeRedirectUri();

  const handleSSOLogin = async () => {
    const result = await WebBrowser.openAuthSessionAsync(
      ssoUrl,
      AuthSession.makeRedirectUri()
    );

    if (result.type === "success" && result.url) {
      const token = extractTokenFromUrl(result.url);

      if (token) {
        await SecureStore.setItemAsync("accessToken", token);
        setToken(token);
        refetch();
        refetchUserVids();
      }
    }
  };

  const extractTokenFromUrl = (url: string) => {
    const urlParams = new URLSearchParams(url.split("?")[1]);
    return urlParams.get("token");
  };

  return (
    <TouchableOpacity
      className="bg-zinc-800 py-2 px-3 rounded-xl w-44"
      onPress={handleSSOLogin}
    >
      <View className="flex flex-row space-x-2">
        <LogIn className="w-10 h-10 text-white" />
        <Text className="font-bold text-white">Sign In</Text>
      </View>
    </TouchableOpacity>
  );
};

export default SignInButton;
