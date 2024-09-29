import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { Video } from "../../../typings";
import { fetchAllVideos } from "../../../lib/apiCalls/video";
import { useQuery } from "@tanstack/react-query";
import VideoCard from "../../../components/VideoCard";

export default function Page() {
  const { data: videos, isLoading } = useQuery({
    queryKey: ["fetchAllVideos"],
    queryFn: fetchAllVideos,
  });

  const onVideoPress = (selectedVid: Video) => {
    router.push("/watch/" + selectedVid._id);
  };

  if (isLoading) {
    return (
      <View className="flex-1">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center">
      <FlatList
        className="mx-4"
        data={videos}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onVideoPress(item)} className="my-3">
            <VideoCard video={item} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
