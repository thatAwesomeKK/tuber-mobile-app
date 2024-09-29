import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Video } from "../typings";
import TimeAgo from "react-native-timeago";

interface Props {
  video: Video;
}

const VideoCard = ({ video }: Props) => {
  return (
    <>
      <Image
        className="h-auto w-full aspect-video rounded-lg shadow-lg"
        source={{ uri: video.thumbnail }}
      />
      <View className="flex flex-row gap-3 mt-1">
        <View className="pt-1">
          <Image
            className="h-10 w-10 rounded-full"
            source={{ uri: video.userId.pfp }}
          />
        </View>
        <View>
          <Text role="heading" className="font-bold text-lg">
            {video.title}
          </Text>
          <View>
            <Text>
              {video.userId.fullName} • {video.views}
              {video.views <= 1 ? " view" : " views"} •
              <TimeAgo time={video.createdAt} />
            </Text>
          </View>
        </View>
      </View>
    </>
  );
};

export default VideoCard;

const styles = StyleSheet.create({});
