import * as Yup from "yup";
import {
  fetchVideoMetadata,
  updateVideoMetadata,
} from "../../../lib/apiCalls/video";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Formik } from "formik";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback } from "react";
import { ActivityIndicator, MD2Colors } from "react-native-paper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

let metadataSchema = Yup.object({
  title: Yup.string().required(),
  description: Yup.string().required(),
  tags: Yup.string().required(),
});

const UpdateMetadataForm = () => {
  const { id } = useLocalSearchParams();
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["fetchVideoById"],
    queryFn: () => fetchVideoMetadata(id as string),
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );

  const { mutate, isPending } = useMutation({
    mutationKey: ["uploadMetadata"],
    mutationFn: updateVideoMetadata,
  });

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
              <Image
                className={`h-full w-full`}
                resizeMode="center"
                source={{ uri: data?.thumbnail || "" }}
              />
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

export default UpdateMetadataForm;
