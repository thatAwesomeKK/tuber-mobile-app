import { View, Text, StyleSheet } from "react-native";
import React, { useRef, useState } from "react";
import { Video } from "../../typings";
import { handleDislike, handleLike } from "../../lib/apiCalls/video";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ThumbsDown, ThumbsUp } from "lucide-react-native";
import { useUserStore } from "../../lib/store";
import { useMutation } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import ConfettiCannon from "react-native-confetti-cannon";
import LottieView from "lottie-react-native";

interface Props {
  metadata?: Video;
}

const ActivityButtons = ({ metadata }: Props) => {
  const { user } = useUserStore();
  const [likes, setLikes] = useState(metadata?.likes.length);
  const [dislikes, setDislikes] = useState(metadata?.dislikes.length);
  const [confetti, setConfetti] = useState(false);

  const [initialLikes, setInitialLikes] = useState(metadata?.likes);
  const [initialDislike, setInitialDislikes] = useState(metadata?.dislikes);

  const confettiRef = useRef<any | null>(null);

  function triggerConfetti() {
    setConfetti(true);
    confettiRef.current?.play(0);
  }

  const { mutate: onLike } = useMutation({
    mutationFn: handleLike,
    onMutate: () => {
      if(!user) return
      triggerConfetti();
      if (initialLikes?.includes(user?.uid || "")) {
        setLikes(likes! - 1);
        setInitialLikes(initialLikes?.filter((id) => id !== user?.uid));
      } else {
        setLikes(likes! + 1);
        setInitialLikes([...initialLikes!, user?.uid!]);
      }

      if (initialDislike?.includes(user?.uid || "")) {
        setDislikes(dislikes! - 1);
        setInitialDislikes(initialDislike?.filter((id) => id !== user?.uid));
      }
    },
  });

  const { mutate: onDislike } = useMutation({
    mutationFn: handleDislike,
    onMutate: () => {
      if(!user) return
      triggerConfetti();
      if (initialDislike?.includes(user?.uid || "")) {
        setDislikes(dislikes! - 1);
        setInitialDislikes(initialDislike?.filter((id) => id !== user?.uid));
      } else {
        setDislikes(dislikes! + 1);
        setInitialDislikes([...initialDislike!, user?.uid!]);
      }

      if (initialLikes?.includes(user?.uid || "")) {
        setLikes(likes! - 1);
        setInitialLikes(initialLikes?.filter((id) => id !== user?.uid));
      }
    },
  });

  if (!metadata) return null;
  return (
    <>
      {confetti && (
        <LottieView
          ref={confettiRef}
          source={require("../../assets/confetti.json")}
          autoPlay={false}
          loop={false}
          style={styles.lottie}
          resizeMode="contain"
          onAnimationFinish={() => setConfetti(false)}
        />
      )}
      <View className="bg-gray-300 px-4 py-2 rounded-full w-32 flex flex-row space-x-5 items-center justify-center mt-3">
        <TouchableOpacity
          onPress={() => onLike(metadata?._id!)}
          className="flex flex-row space-x-1"
        >
          {initialLikes?.includes(user?.uid || "") ? (
            <ThumbsUp className="w-2 h-2" fill={"black"} color="black" />
          ) : (
            <ThumbsUp className="w-2 h-2" color="black" />
          )}
          <Text>{likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onDislike(metadata?._id!)}
          className="flex flex-row space-x-1"
        >
          {initialDislike?.includes(user?.uid || "") ? (
            <ThumbsDown className="w-2 h-2" fill={"black"} color="black" />
          ) : (
            <ThumbsDown className="w-2 h-2" color="black" />
          )}
          <Text>{dislikes}</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  lottie: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    pointerEvents: "none",
  },
});

export default ActivityButtons;
