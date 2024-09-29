import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Search } from "lucide-react-native";
import { useMutation, useQuery } from "@tanstack/react-query";
import { searchVideos } from "../../lib/apiCalls/video";
import { useVideoStore } from "../../lib/store";

let searchSchema = Yup.object({
  query: Yup.string().required(),
});

const SearchForm = () => {
  const { setSearchVids } = useVideoStore();
  const initialValues = {
    query: "",
  };

  const { mutateAsync } = useMutation({
    mutationKey: ["searchVideoByQuery"],
    mutationFn: searchVideos,
    onSettled: (data) => {
      setSearchVids(data);
    },
  });

  return (
    <View>
      <Formik
        initialValues={initialValues}
        validationSchema={searchSchema}
        onSubmit={async (values) => {
          await mutateAsync(values.query);
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <View className="flex flex-row w-full border-gray-400 border rounded-lg overflow-hidden px-3 py-3.5">
            <TextInput
              onChangeText={handleChange("query")}
              onBlur={handleBlur("query")}
              value={values.query}
              placeholder="Find something..."
              className="px-2 rounded-xl flex-1"
            />
            <TouchableOpacity
              className="rounded-xl flex justify-center items-center"
              //@ts-expect-error
              onPress={handleSubmit}
            >
              <Text>
                <Search size={25} className="text-black" />
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </View>
  );
};

export default SearchForm;
