import * as Yup from "yup";
import {
  fetchVideoMetadata,
  updateVideoMetadata,
} from "../../../lib/apiCalls/video";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Formik } from "formik";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, MD2Colors } from "react-native-paper";
import { socket } from "../../../lib/socket";
import * as SecureStore from "expo-secure-store";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

let metadataSchema = Yup.object({
  title: Yup.string().required(),
  description: Yup.string().required(),
  tags: Yup.string(),
});

const MetadataForm = () => {
  const { id } = useLocalSearchParams();
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["fetchVideoById"],
    queryFn: () => fetchVideoMetadata(id as string),
  });

  const [isPublished, setIsPublished] = useState(data?.isPublished);
  const [thumbnail, setThumbnail] = useState<string | null>(
    data?.thumbnail || null
  );

  useEffect(() => {
    refetch();
  }, [id]);

  const { mutate, isPending } = useMutation({
    mutationKey: ["uploadMetadata"],
    mutationFn: updateVideoMetadata,
  });

  useFocusEffect(
    useCallback(() => {
      if (socket.disconnected) {
        socket.connect();
      }

      async function onConnect() {
        console.log("Socket Connected!");
        socket.emit("connect-upload-form", {
          uploadId: await SecureStore.getItemAsync("uploadId"),
        });
      }

      function onDisconnect() {
        console.log("Socket disconnected!");
      }

      function onThumbnailUpload(payload: any) {
        const { thumbnail } = payload;
        setThumbnail(thumbnail);
        console.log("Uploaded Thumbnail: ", thumbnail);
      }

      function onVideoProcessComplete(payload: any) {
        console.log(payload.message);
        setIsPublished(true);
        socket.disconnect();
      }

      socket.on("video-thumbnail-complete", onThumbnailUpload);
      socket.on("video-process-complete", onVideoProcessComplete);
      socket.on("connect", onConnect);
      socket.on("disconnect", onDisconnect);

      return () => {
        socket.disconnect();
        socket.off("video-process-complete", onVideoProcessComplete);
        socket.off("video-thumbnail-complete", onThumbnailUpload);
        socket.off("connect", onConnect);
        socket.off("disconnect", onDisconnect);
      };
    }, [])
  );

  const initialValues = {
    title: data?.title || "",
    description: data?.description || "",
    tags: data?.tags.join(",") || "",
  };

  if (isLoading || isRefetching)
    return (
      <View className="flex-1 justify-center items-center">
        <Text>
          <ActivityIndicator
            size={100}
            animating={true}
            color={MD2Colors.blueGrey600}
          />
        </Text>
      </View>
    );
  return (
    <View className="mt-10 mx-6 flex-1">
      <Formik
        initialValues={initialValues}
        validationSchema={metadataSchema}
        onSubmit={(values) =>
          mutate({
            ...values,
            tags: values.tags.split(",").map((tag) => tag.trim()),
            videoId: data?._id,
          })
        }
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <KeyboardAwareScrollView>
            <View className="relative aspect-video rounded-md shadow-lg bg-zinc-600 overflow-hidden">
              <View className="flex justify-center items-center absolute z-50 w-full h-full">
                {!isPublished && (
                  <Text>
                    <ActivityIndicator
                      size={50}
                      animating={true}
                      color={MD2Colors.blueGrey600}
                    />
                  </Text>
                )}
              </View>
              {thumbnail && (
                <Image
                  className={`h-full w-full ${
                    isPublished ? "opacity-100" : "opacity-50"
                  }`}
                  resizeMode="center"
                  source={{ uri: thumbnail || "" }}
                />
              )}
            </View>

            <View className="flex space-y-4 mt-10">
              <View>
                <Text className="font-psemibold text-xl mb-1">Title</Text>
                <TextInput
                  onChangeText={handleChange("title")}
                  onBlur={handleBlur("title")}
                  value={values.title}
                  className="border-gray-400 border py-3 px-2 rounded-xl"
                />
              </View>
              <View>
                <Text className="font-psemibold text-xl mb-1">Description</Text>
                <TextInput
                  onChangeText={handleChange("description")}
                  onBlur={handleBlur("description")}
                  value={values.description}
                  multiline={true}
                  //@ts-expect-error
                  rows={6}
                  className="border-gray-400 border py-3 px-2 rounded-xl"
                />
              </View>
              <View>
                <Text className="font-psemibold text-xl mb-1">Tags</Text>
                <TextInput
                  onChangeText={handleChange("tags")}
                  onBlur={handleBlur("tags")}
                  value={values.tags}
                  placeholder="e.g. funny, comedy, viral"
                  className="border-gray-400 border py-3 px-2 rounded-xl"
                />
              </View>
              <View className="flex items-end justify-center">
                <TouchableOpacity
                  className="bg-zinc-800 w-40 py-2.5 rounded-full"
                  //@ts-expect-error
                  onPress={handleSubmit}
                >
                  <Text className="text-center text-white font-psemibold">
                    {isPending ? "Loading..." : " Update!"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAwareScrollView>
        )}
      </Formik>
    </View>
  );
};

export default MetadataForm;
