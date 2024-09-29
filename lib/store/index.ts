import { create } from "zustand";
import { User, Video } from "../../typings";

type UserStore = {
  user: User | null;
  setUser: (user: User) => void;
};

export const useUserStore = create<UserStore>()((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

type VideoStore = {
  video: any;
  loading: boolean;
  uploadProgress: number;
  setLoading: (loading: boolean) => void;
  setVideo: (video: any) => void;
  setUploadProgress: (progress: number) => void;
  searchVids: Video[];
  setSearchVids: (vids: any) => void;
};

export const useVideoStore = create<VideoStore>()((set) => ({
  video: null,
  setVideo: (video) => set({ video }),
  uploadProgress: 0,
  setUploadProgress: (progress) => set({ uploadProgress: progress }),
  loading: false,
  setLoading: (loading) => set({ loading }),
  searchVids: [],
  setSearchVids: (vids) => set({ searchVids: vids }),
}));
