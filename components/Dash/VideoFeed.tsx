import { FlatList, Text, View } from "react-native";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUserVids } from "../../lib/apiCalls/profile";
import VideoComponent from "./VideoComponent";

const VideoFeed = () => {
  const {
    data: videos,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["fetchUserVids"],
    queryFn: fetchUserVids,
  });

  if (isError) {
    return (
      <View className="flex-1">
        <Text>Error fetching videos</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View className="flex-1">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View className="mt-10 bg-zinc-300 p-3 rounded-md mb-20">
      <FlatList
        data={videos}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <VideoComponent video={item} />}
      />
    </View>
  );
};

export default VideoFeed;
