import { io } from "socket.io-client";
import * as config from "../config.json";

const URL = config.networking.serverUrl;
const socket = io(URL, { autoConnect: false });

socket.onAny((event, ...args) => {
  console.log(event, args);
});

export default socket;
