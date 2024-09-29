import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as Yup from "yup";
import { createComment, editComment } from "../../lib/apiCalls/comment";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";
import { Formik } from "formik";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { Comment } from "../../typings";

const commentSchema = Yup.object({
  comment: Yup.string().required(),
});

interface CommentFormProps {
  videoId: string;
  comment?: Comment;
  setIsEditting?: Dispatch<SetStateAction<boolean>>;
}

function CommentForm({ videoId, comment, setIsEditting }: CommentFormProps) {
  const initialValues = {
    comment: comment?.comment || "",
  };

  const { refetch } = useQuery({
    queryKey: ["fetchVideoComments"],
  });

  const { mutateAsync, isPending } = useMutation({
    mutationKey: [comment ? "editComment" : "createComment"],
    mutationFn: comment ? editComment : createComment,
    onSuccess: async () => {
      refetch();
      if (setIsEditting) setIsEditting(false);
    },
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={commentSchema}
      onSubmit={async (values) => {
        await mutateAsync({ videoId, comment: values.comment });
      }}
    >
      {({ handleChange, handleBlur, handleSubmit, values }) => (
        <>
          <BottomSheetTextInput
            placeholder="Comment..."
            onBlur={handleBlur("comment")}
            onChangeText={handleChange("comment")}
            value={values.comment}
            className="border-gray-400 border py-3 px-2 rounded-xl"
            keyboardType="default"
            style={styles.input}
          />
          <View className="flex items-end justify-center mt-2">
            <TouchableOpacity
              className="bg-zinc-800 w-40 py-2.5 rounded-full"
              //@ts-expect-error
              onPress={handleSubmit}
            >
              <Text className="text-center text-white">
                {isPending ? "Loading..." : comment ? "Edit" : "Comment"}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  input: {
    borderColor: "gray",
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
});

export default CommentForm;
