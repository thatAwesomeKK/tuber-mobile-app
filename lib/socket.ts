import { io } from "socket.io-client";

// const url = "https://gateway.thatawesomekk.eu.org";
const url = "http://192.168.29.13:5005";

export const socket = io(url, {
  autoConnect: false,
});
