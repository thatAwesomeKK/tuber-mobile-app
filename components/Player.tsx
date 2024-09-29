import { useCallback, useEffect, useRef, useState } from "react";
import { ResizeMode, Video } from "expo-av";
import * as ScreenOrientation from "expo-screen-orientation";
import { useFocusEffect } from "expo-router";

interface Props {
  videoLink: string;
}

const Player = ({ videoLink }: Props) => {
  const videoRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);

  const onFullscreenUpdate = async ({
    fullscreenUpdate,
  }: {
    fullscreenUpdate: any;
  }) => {
    switch (fullscreenUpdate) {
      case 1:
        await ScreenOrientation.unlockAsync();
        break;
      case 3:
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT
        );
        break;
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(false);
      return () => {
        setLoading(true);
      };
    }, [])
  );

  return (
    <>
      {!loading && (
        <Video
          key={videoLink}
          ref={videoRef}
          className="aspect-video w-full h-auto"
          source={{
            uri: videoLink,
          }}
          shouldPlay
          onLoad={() => console.log("Video loaded")}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          onFullscreenUpdate={onFullscreenUpdate}
        />
      )}
    </>
  );
};

export default Player;
