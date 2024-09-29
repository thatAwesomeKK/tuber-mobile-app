import { Text, View } from "react-native";
import React from "react";
import { fetchVideosByTag } from "../../lib/apiCalls/video";
import RecommendedCard from "./RecommendedCard";
import { useQuery } from "@tanstack/react-query";

interface Props {
  videoId: string;
}

const Recommended = ({ videoId }: Props) => {
  const { data: recommended, isLoading } = useQuery({
    queryKey: ["fetchVideosByTag"],
    queryFn: () => fetchVideosByTag(videoId),
  });

  if (isLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View className="my-4">
      <Text className="text-xl font-bold ml-1">Recommended</Text>
      {recommended?.map((video, i) => (
        <RecommendedCard key={i} video={video} />
      ))}
    </View>
  );
};

export default Recommended;
