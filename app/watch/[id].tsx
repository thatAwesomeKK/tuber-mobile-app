import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocalSearchParams } from "expo-router";
import Player from "../../components/Player";
import { fetchVideoStream } from "../../lib/apiCalls/video";
import Metadata from "../../components/Metadata";
import Recommended from "../../components/Recommended";
import Comments from "../../components/Comments";
import BottomSheet, {
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import CommentForm from "../../components/Comments/CommentForm";
import { useUserStore } from "../../lib/store";

const WatchPage = () => {
  const [videoLink, setVideoLink] = useState<any | null>(null);
  const { user } = useUserStore();

  const { id } = useLocalSearchParams();

  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ["25", "50%", "75%", "100%"], []);

  const snapToIndex = (index: number) => {
    bottomSheetRef.current?.snapToIndex(index);
  };

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  useEffect(() => {
    async function fetch() {
      const payload = await fetchVideoStream(id as string);
      setVideoLink(payload.videoLink);
    }
    fetch();
  }, []);

  return (
    <BottomSheetModalProvider>
      <View className="flex-1">
        {videoLink && <Player videoLink={videoLink} />}
        <ScrollView className="mx-2" showsVerticalScrollIndicator={false}>
          <Metadata videoId={id as string} />
          <TouchableOpacity
            className="m-3 border-2 border-zinc-800 py-2 rounded-full"
            onPress={() => snapToIndex(1)}
          >
            <Text className="text-center">Comment</Text>
          </TouchableOpacity>
          <Recommended videoId={id as string} />
        </ScrollView>
      </View>
      <BottomSheet
        snapPoints={snapPoints}
        enablePanDownToClose
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
        index={-1}
      >
        <BottomSheetView style={{ flex: 1, marginHorizontal: 15 }}>
          {user && <CommentForm videoId={id as string} />}
          <Comments videoId={id as string} />
        </BottomSheetView>
      </BottomSheet>
    </BottomSheetModalProvider>
  );
};

export default WatchPage;
