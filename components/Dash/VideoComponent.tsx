import { Image, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Video } from "../../typings";
import { Pencil, Trash2 } from "lucide-react-native";
import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteVideo } from "../../lib/apiCalls/video";
import { ActivityIndicator, MD2Colors } from "react-native-paper";
import { Link } from "expo-router";

interface Props {
  video: Video;
}

const VideoComponent = ({ video }: Props) => {
  const { refetch } = useQuery({
    queryKey: ["fetchUserVids"],
  });

  const { refetch: refetchAll } = useQuery({
    queryKey: ["fetchAllVideos"],
  });

  const { mutate: handleDelete, isPending } = useMutation({
    mutationKey: ["handleDeleteVideo"],
    mutationFn: deleteVideo,
    onSuccess: async () => {
      refetch();
      refetchAll();
    },
  });

  return (
    <View className="flex flex-row bg-white py-4 px-5 w-full my-2 rounded-md overflow-hidden space-x-4">
      <Image
        className="aspect-video h-auto w-36 rounded-md"
        source={{ uri: video.thumbnail }}
      />
      <View className="flex space-y-2">
        <View>
          <Text className="font-psemibold -mb-1">{video.title}</Text>
          <Text>{video.description.slice(0, 20)}...</Text>
        </View>
        <View className="flex flex-row space-x-2">
          <Link href={`/(authenticated)/update/${video._id}`} asChild>
            <TouchableOpacity>
              <Pencil size={23} className="text-black" />
            </TouchableOpacity>
          </Link>
          <TouchableOpacity onPress={() => handleDelete(video._id)}>
            {isPending ? (
              <ActivityIndicator animating={true} color={MD2Colors.red800} />
            ) : (
              <Trash2 size={23} className="text-black" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default VideoComponent;
