import { FlatList, TouchableOpacity, View } from "react-native";
import React from "react";
import VideoCard from "../../components/VideoCard";
import { router } from "expo-router";
import { Video } from "../../typings";
import { useVideoStore } from "../../lib/store";

const Search = () => {
  const { searchVids } = useVideoStore();

  const onVideoPress = (selectedVid: Video) => {
    router.push("/watch/" + selectedVid._id);
  };

  return (
    <View>
      <FlatList
        className="mx-4"
        data={searchVids}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onVideoPress(item)} className="my-3">
            <VideoCard video={item} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Search;
