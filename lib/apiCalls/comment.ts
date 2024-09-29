import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Comment } from "../../typings";
import { base_url } from "../constants";

// const base_url = "http://192.168.29.13:5005/api/comment";

const commentAxios = axios.create({
  baseURL: base_url + "/comment",
});

export const createComment = async (payload: {
  videoId: string;
  comment: string;
}) => {
  try {
    const token = await SecureStore.getItemAsync("accessToken");
    const response = await commentAxios.post("/create", payload, {
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  } catch (error: any) {
    console.log(error.response.data.message);
  }
};

export async function fetchCommentByVideo(videoId: string) {
  try {
    const payload = await commentAxios.get(`/fetch-by-video/${videoId}`);
    const comments: Comment[] = payload.data.comments;
    return comments;
  } catch (error: any) {
    console.log(error.response.data.message);
  }
}

export const editComment = async (payload: {
  videoId: string;
  comment: string;
}) => {
  try {
    const token = await SecureStore.getItemAsync("accessToken");
    const response = await commentAxios.put("/edit", payload, {
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  } catch (error: any) {
    return error.response.data.message;
  }
};

export const deleteComment = async (videoId: string) => {
  try {
    const token = await SecureStore.getItemAsync("accessToken");
    const response = await commentAxios.delete(`/delete/${videoId}`, {
      headers: { Authorization: token },
    });
    return response.data;
  } catch (error: any) {
    return error.response.data.message;
  }
};
