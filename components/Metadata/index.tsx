import React from "react";
import { fetchVideoMetadata, handleLike } from "../../lib/apiCalls/video";
import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import TimeAgo from "react-native-timeago";
import { useQuery } from "@tanstack/react-query";
import ActivityButtons from "./ActivityButtons";

interface Props {
  videoId: string;
}

const Metadata = ({ videoId }: Props) => {
  const {
    data: metadata,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["fetchVideoMetadata"],
    queryFn: () => fetchVideoMetadata(videoId),
  });

  if (isLoading || isFetching)
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  return (
    <View className="mx-3 mt-3">
      <View>
        <Text className="text-xl font-psemibold">{metadata?.title}</Text>
        <View className="flex items-end flex-row space-x-1">
          <Text>{metadata?.views} views</Text>
          <Text>•</Text>
          <Text>
            {metadata?.createdAt && <TimeAgo time={metadata?.createdAt} />}
          </Text>
          {metadata?.tags.map((tag, i) => (
            <Text className="text-xs text-gray-400" key={i}>
              #{tag}
            </Text>
          ))}
        </View>
        <View className="bg-gray-300 py-2 px-2 rounded-lg mt-2 mb-3 shadow-md shadow-black">
          <Text>{metadata?.description}</Text>
        </View>
        <View className="flex flex-row items-center justify-between">
          <View className="flex flex-row items-center justify-center gap-2">
            <Image
              className="h-10 w-10 rounded-full"
              source={{ uri: metadata?.userId.pfp }}
            />
            <Text className="font-pmedium text-sm">
              {metadata?.userId.fullName}
            </Text>
            <Text className="text-gray-500 text-xs">200k</Text>
          </View>
          <Pressable className="bg-red-500 p-3 rounded-full shadow-md shadow-black">
            <Text className="text-sm font-pmedium">Subscribe</Text>
          </Pressable>
        </View>
      </View>
      <ActivityButtons metadata={metadata} />
    </View>
  );
};

export default Metadata;
