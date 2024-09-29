import axios from "axios";
import { Video } from "../../typings";
import * as SecureStore from "expo-secure-store";
import { base_url } from "../constants";
import * as FileSystem from "expo-file-system";

const videoAxios = axios.create({
  baseURL: base_url + "/video",
});

const CHUNK_SIZE = 10 * 1024 * 1024;

export const uploadVideo = async (
  payload: any,
  setUploadProgress: (progress: number) => void
) => {
  try {
    const token = await SecureStore.getItemAsync("accessToken");
    const fileUri = payload.uri;

    const fileName = `${Date.now()}`; // Generate a unique file name

    const fileInfo: any = await FileSystem.getInfoAsync(fileUri);
    const fileSize = fileInfo.size;
    const totalChunks = Math.ceil(fileSize / CHUNK_SIZE);

    for (let i = 0; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, fileSize);

      // // Read chunk
      const chunk = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
        position: start,
        length: end - start,
      });

      // // Create a temporary file path for the chunk
      const chunkPath = `${FileSystem.documentDirectory}/chunk-${i}.mp4`;
      await FileSystem.writeAsStringAsync(chunkPath, chunk, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // // Upload the chunk
      const formData = new FormData();
      //@ts-ignore
      formData.append("video", {
        uri: chunkPath,
        type: payload.mimeType,
        name: fileName,
      });

      await videoAxios.post(`/upload`, formData, {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: token,
        },
      });
      // setTimeout(() => {
      const progress = (i + 1) / totalChunks;
      console.log(progress);
      // }, 2000);
      // Optionally, remove the chunk file after uploading
      await FileSystem.deleteAsync(chunkPath);

      setUploadProgress(progress);
    }
    const res = await videoAxios.post(
      "/upload-complete",
      {
        originalname: fileName,
        uploadId: await SecureStore.getItemAsync("uploadId"),
      },
      { headers: { Authorization: token } }
    );
    return res.data;
  } catch (error: any) {
    console.log(error);
    return error?.response;
  }
};

export async function fetchAllVideos() {
  const payload = await videoAxios.get("/fetch");
  const videos: Video[] = payload.data.videos;
  return videos;
}

export async function fetchVideoStream(fileid: string) {
  const payload = await videoAxios.get(`/stream?fileid=${fileid}`);
  return payload.data;
}

export async function fetchVideoMetadata(videoId: string) {
  const payload = await videoAxios.get(`/fetch-metadata/${videoId}`);
  const video: Video = payload.data.video;
  return video;
}

export const fetchVideosByTag = async (videoId: string) => {
  const payload = await videoAxios.get(`/fetch-by-tag/${videoId}`);
  const videos: Video[] = payload.data.videos;
  return videos;
};

export const handleLike = async (videoId: string) => {
  const token = await SecureStore.getItemAsync("accessToken");
  const res = await videoAxios.put(
    "/handle-like",
    { videoId },
    {
      headers: {
        Authorization: token,
      },
    }
  );
  return res.data;
};

export const handleDislike = async (videoId: string) => {
  try {
    const token = await SecureStore.getItemAsync("accessToken");
    const res = await videoAxios.put(
      "/handle-dislike",
      { videoId },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return res.data;
  } catch (error: any) {
    return error.response.data.message;
  }
};

export const deleteVideo = async (videoId: string) => {
  try {
    const token = await SecureStore.getItemAsync("accessToken");
    const payload = await videoAxios.delete(`/delete/${videoId}`, {
      headers: {
        Authorization: token,
      },
    });
    return payload.data;
  } catch (error: any) {
    console.log(error.response.data);
    return error.response.data.message;
  }
};

export const updateVideoMetadata = async (payload: any) => {
  console.log(payload);

  try {
    const videoId = payload.videoId;
    const token = await SecureStore.getItemAsync("accessToken");
    const res = await videoAxios.put(`/update-metadata/${videoId}`, payload, {
      headers: {
        Authorization: token,
      },
    });

    return res.data;
  } catch (error: any) {
    return error.response.data.message;
  }
};

export const searchVideos = async (s: string) => {
  if (!s) return [];
  const payload = await videoAxios
    .get(`/search?s=${s}`)
    .then((res) => res.data);

  const videos: Video[] = payload.videos;
  return videos;
};
