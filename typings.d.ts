export type Video = {
  _id: string;
  videoId: string;
  userId: PublicUser;
  title: string;
  description: string;
  thumbnail: string;
  likes: Array<string>;
  dislikes: Array<string>;
  createdAt: Date;
  views: number;
  tags: Array<string>;
  isPublished: boolean;
};

type PublicUser = {
  fullName: string;
  pfp: string;
  uid: string;
};

type User = {
  _id: string;
  fullName: string;
  email: string;
  pfp: string;
  uid: string;
  createdAt: Date;
};

export type Comment = {
  _id: string;
  videoId: string;
  userId: PublicUser;
  comment: string;
  createdAt: Date;
};
