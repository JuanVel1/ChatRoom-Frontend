import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import io, { Socket } from 'socket.io-client'; 

interface Message {
  user: string;
  message: string;
  room: string;
}

const Chat = () => {
  const location = useLocation();
  const { username, roomCode } = location.state || {};
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const navigate = useNavigate();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io("https://chatroom-backend-2po9.onrender.com"); // Cambia la URL según tu servidor
    
    socketRef.current = socket;

    socket.emit('join', { username, room: roomCode });

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('messageFromServer', (newMessage: Message) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.disconnect();
    };
  }, [username, roomCode]);

  const handleSendMessage = () => {
    const newMessage: Message = { user: username, message, room: roomCode };
    socketRef.current?.emit('messageFromClient', newMessage);
  };

  return (
    <div className="p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="ballet-title text-6xl p-5">Chat room</h1>
          <img
            src="src/assets/CS_Star_2.svg"
            width={40}
            className="animated"
            alt="a star moving"
          />
        </div>

        <button
          onClick={() => navigate('/')}
          style={isConnected ? { display: 'block' } : { display: 'none' }}
          className="w-20 h-11 alumni-sans-pinstripe-regular-italic text-white font-bold rounded focus:outline-none focus:shadow-outline bg-gradient-to-tr from-blue-700 to-amber-500"
        >
          Logout
        </button>
      </div>

      {!isConnected && (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-red-500">Failed to connect to the server. Please try again later.</p>
        </div>
      )}

      {isConnected && (
        <>
          <div
            style={{ minHeight: '440px', overflowY: 'auto' }}
            className="bg-white p-5 rounded-lg mb-5 border border-amber-300"
          >
            {messages.map((msg, index) => (
              <p key={index}>
                {msg && msg.user && msg.message ? (
                  <>
                    <strong>{msg.user}:</strong> {msg.message}
                  </>
                ) : (
                  <span>Invalid message format</span>
                )}
              </p>
            ))}
          </div>
          <div className="flex bottom-0 fixed m-2 p-2">
            <input
              type="text"
              placeholder="Enter your message"
              className="mr-2 p-2 border border-pink-700 rounded"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              onClick={handleSendMessage}
              className="alumni-sans-pinstripe-regular-italic w-100 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline bg-gradient-to-tr from-blue-700 to-amber-500 false"
            >
              Send Message
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Chat;
