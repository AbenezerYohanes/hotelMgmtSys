import { io as ioClient } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_BASE?.replace('/api','') || 'http://localhost:4000';

let socket;
export const connectSocket = () => {
  if (socket) return socket;
  socket = ioClient(SOCKET_URL, { transports: ['websocket'] });
  return socket;
};

export const onEvent = (event, cb) => {
  const s = connectSocket();
  s.on(event, cb);
  return () => s.off(event, cb);
};

export default { connectSocket, onEvent };
