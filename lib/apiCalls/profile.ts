import axios from "axios";
import { base_url } from "../constants";
import * as SecureStore from "expo-secure-store";

const userAxios = axios.create({
  baseURL: base_url + "/user",
});

export const fetchUserVids = async () => {
  try {
    const token = await SecureStore.getItemAsync("accessToken");
    const payload = await userAxios.get("/videos", {
      headers: {
        Authorization: token,
      },
    });

    return payload.data.videos;
  } catch (error) {
    console.log(error);
  }
};

export const fetchUser = async () => {
  try {
    const token = await SecureStore.getItemAsync("accessToken");
    const payload = await userAxios.get("/fetch", {
      headers: {
        Authorization: token,
      },
    });
    return payload.data;
  } catch (error: any) {
    console.log(error.response.data.message);
    return error.response.data;
  }
};
