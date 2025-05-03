import { io } from "socket.io-client";

const storedUser = JSON.parse(localStorage.getItem("user"));
const socket = io("http://localhost:8000", {
  query: { username: storedUser?.username || "" },
});

export default socket;
