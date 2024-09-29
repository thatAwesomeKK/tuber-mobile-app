import { Text, TouchableOpacity, View } from "react-native";
import React, { useCallback, useEffect } from "react";
import { useVideoStore } from "../lib/store";
import * as ImagePicker from "expo-image-picker";
import { uploadVideo } from "../lib/apiCalls/video";
import { Upload } from "lucide-react-native";
import * as Progress from "react-native-progress";
import { router, useFocusEffect } from "expo-router";
import { socket } from "../lib/socket";
import * as SecureStore from "expo-secure-store";

const UploadModal = () => {
  const { setUploadProgress, setLoading, loading, uploadProgress } =
    useVideoStore();

  const selectVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      quality: 1,
      allowsMultipleSelection: false,
    });
    if (!result.canceled) {
      setLoading(true);
      const asset = result.assets[0];
      const data = await uploadVideo(asset, setUploadProgress);
      console.log(data);
      // setVideo(data.id);
      setLoading(false);
      router.replace(`/(authenticated)/upload/${data.id}`);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (socket.disconnected) {
        socket.connect();
      }

      function onConnect() {
        socket.emit("connect-client");
      }

      function onDisconnect() {
        console.log("Socket disconnected!");
      }

      function onConnected(payload: any) {
        console.log(payload);
        const uploadId = payload.uploadId;

        SecureStore.setItem("uploadId", uploadId);
      }

      socket.on("connected", onConnected);
      socket.on("connect", onConnect);
      socket.on("disconnect", onDisconnect);

      return () => {
        socket.disconnect();
        socket.off("connect", onConnect);
        socket.off("connected", onConnected);
        socket.off("disconnect", onDisconnect);
      };
    }, [])
  );

  return (
    <View className="mt-28">
      <View className="mb-10">
        <Text className="text-5xl font-pbold py-2 -mb-4 text-center">
          Share It!
        </Text>
        <Text className="text-base font-pmedium text-gray-400 text-center">
          Share your video moments or
        </Text>
        <Text className="text-base font-pmedium text-gray-400 text-center">
          aything directly from your phone!
        </Text>
      </View>
      <TouchableOpacity
        className="border border-zinc-300 w-full h-96 flex justify-center items-center rounded-3xl"
        onPress={selectVideo}
      >
        <View>
          {loading ? (
            <Progress.Pie progress={uploadProgress} size={150} />
          ) : (
            <Upload size={150} className="text-black" />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default UploadModal;
