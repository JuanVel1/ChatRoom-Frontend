import { useState } from "react";
import { io } from "socket.io-client";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username || !roomCode) {
      setError("Please, enter an username and a room code");
    } else {
      const socket = io("http://localhost:3010"); // Cambia la URL según tu servidor
      socket.emit("join", { username, room: roomCode });
      console.log(
        `Entering the room ${roomCode} with the username ${username}`
      );
      setRoomCode("");
      setUsername("");
      navigate("/chat", { state: { username, roomCode } });
      enqueueSnackbar("Welcome to the chat room", {
        variant: "success",
        autoHideDuration: 4000,
      });
    }
  };

  return (
    <div className="  false flex flex-col items-center p-5 mb-2 justify-center h-screen">
      <h1 className="ballet-title text-8xl font-bold">Welcome </h1>
      <h1 className="text-3xl font-bold mb-4 alumni-sans-pinstripe-regular-italic">
        to your{" "}
        <b className="bg-gradient-to-tr from-amber-500 to-blue-800 bg-clip-text text-transparent">
          chat
        </b>{" "}
        Room ✨
      </h1>
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2 josefin-slab-form"
              htmlFor="username"
            >
              Username:
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2 josefin-slab-form"
              htmlFor="roomCode"
            >
              Room code:
            </label>
            <input
              id="roomCode"
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          {error && <div className="mb-4 text-red-500">{error}</div>}
          <button
            type="submit"
            className="alumni-sans-pinstripe-regular-italic w-100 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline bg-gradient-to-tr from-blue-700 to-amber-500 false"
          >
            Start Chating
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
