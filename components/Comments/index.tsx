import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React from "react";
import { Text } from "react-native";
import { fetchCommentByVideo } from "../../lib/apiCalls/comment";
import { ActivityIndicator, MD2Colors } from "react-native-paper";
import { useMutation, useQuery } from "@tanstack/react-query";
import CommentCard from "./CommentCard";

interface Props {
  videoId: string;
}

const Comments = ({ videoId }: Props) => {
  const { data: comments, isLoading } = useQuery({
    queryKey: ["fetchVideoComments"],
    queryFn: () => fetchCommentByVideo(videoId),
    refetchOnWindowFocus: false,
  });

  if (isLoading)
    return <ActivityIndicator animating={true} color={MD2Colors.red800} />;
  return (
    <>
      <Text className="text-2xl font-pbold">
        {comments?.length} {comments?.length! <= 1 ? "Comment" : "Comments"}
      </Text>
      <BottomSheetScrollView showsVerticalScrollIndicator={false}>
        {comments?.map((comment, i) => (
          <CommentCard key={i} comment={comment} />
        ))}
      </BottomSheetScrollView>
    </>
  );
};

export default Comments;
