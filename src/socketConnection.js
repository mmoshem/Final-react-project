import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // ודאי שהכתובת תואמת לשרת שלך

socket.on("connect", () => {
  console.log("✅ Connected to socket.io server!", socket.id);
});

export default socket;
