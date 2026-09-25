import { io } from 'socket.io-client';

const SOCKET_URL = window.location.port === '5173' ? 'http://localhost:5000' : window.location.origin;

let socket = null;

export const initSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 2000
    });

    socket.on('connect', () => {
      console.log('⚡ Connected to Weather Sentinel Real-Time WebSocket stream');
    });

    socket.on('disconnect', () => {
      console.warn('⚠️ Disconnected from Weather Sentinel stream');
    });
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initSocket();
  }
  return socket;
};
