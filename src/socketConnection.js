import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // ודאי שהכתובת תואמת לשרת שלך

export default socket;
