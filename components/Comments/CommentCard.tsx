import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { ActivityIndicator, Avatar, MD2Colors } from "react-native-paper";
import { Comment } from "../../typings";
import TimeAgo from "react-native-timeago";
import { Pencil, Trash2 } from "lucide-react-native";
import { useUserStore } from "../../lib/store";
import CommentForm from "./CommentForm";
import { deleteComment } from "../../lib/apiCalls/comment";
import { useMutation, useQuery } from "@tanstack/react-query";

interface Props {
  comment: Comment;
}

const CommentCard = ({ comment }: Props) => {
  const { user } = useUserStore();
  const [isEditting, setIsEditting] = useState(false);

  const { refetch } = useQuery({
    queryKey: ["fetchVideoComments"],
  });

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: deleteComment,
    onSettled: () => {
      refetch();
    },
  });

  const handleEdit = () => {
    setIsEditting(true);
  };

  return (
    <View className="flex flex-row gap-2 pt-1 pb-3 px-2 bg-gray-300 m-0 my-2 rounded-lg">
      {isEditting ? (
        <View className="flex-1">
          <CommentForm
            videoId={comment.videoId}
            comment={comment}
            setIsEditting={setIsEditting}
          />
        </View>
      ) : (
        <>
          <Avatar.Image size={40} source={{ uri: comment.userId.pfp }} />
          <View className="flex-1 flex-row justify-between items-center">
            <View>
              <View className="flex flex-row items-center gap-2">
                <Text className="text-xs font-plight text-gray-400">
                  @{comment.userId.fullName}
                </Text>
                <Text className="text-xs font-plight text-gray-400">•</Text>
                <Text className="text-xs font-plight text-gray-400">
                  <TimeAgo time={comment.createdAt} />
                </Text>
              </View>
              <Text className="text-sm font-pregular">{comment.comment}</Text>
            </View>
            <View className="flex flex-row gap-2">
              {user?.uid === comment.userId.uid && (
                <>
                  <TouchableOpacity onPress={() => handleEdit()}>
                    <Pencil className="h-4 w-4 text-white" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => mutate(comment.videoId)}>
                    {isSuccess || isPending ? (
                      <ActivityIndicator
                        animating={true}
                        color={MD2Colors.red800}
                      />
                    ) : (
                      <Trash2 className="h-4 w-4 text-white" />
                    )}
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </>
      )}
    </View>
  );
};

export default CommentCard;
