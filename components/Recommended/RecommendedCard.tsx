import { Image, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Video } from "../../typings";
import TimeAgo from "react-native-timeago";
import { useRouter } from "expo-router";

interface Props {
  video: Video;
}

const RecommendedCard = ({ video }: Props) => {
  const router = useRouter();
  const onVideoPress = () => {
    console.log("Video pressed: " + video.title);
    router.push("/watch/" + video._id );
  };
  return (
    <TouchableOpacity onPress={onVideoPress} className="my-3">
      <Image
        className="h-auto w-full aspect-video rounded-lg shadow-lg shadow-black"
        source={{ uri: video.thumbnail }}
      />
      <View className="ml-1">
        <Text className="font-bold text-lg">{video.title}</Text>
        <View className="flex flex-row items-center">
          <Text className="font-bold text-gray-400 text-xs">
            {video.userId.fullName}
          </Text>
          <Text> • </Text>
          <Text className="font-bold text-gray-400 text-xs">
            {video.views} views
          </Text>
          <Text> • </Text>
          <Text className="font-bold text-gray-400 text-xs">
            <TimeAgo time={video.createdAt} />
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RecommendedCard;
