// Frontend/src/utils/socket.js
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || 'https://backend-production-ec018.up.railway.app';

let socket = null;

/**
 * Initialize socket connection with user authentication
 * @param {string} userId - The authenticated user's ID
 * @returns {Socket} The socket instance
 */
export const initSocket = (userId) => {
  if (socket?.connected) {
    console.log('⚠️ Socket already connected');
    return socket;
  }

  console.log('🔌 Initializing socket connection to:', SOCKET_URL);

  socket = io(SOCKET_URL, {
    transports: ['websocket', 'polling'],
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    autoConnect: true,
  });

  socket.on('connect', () => {
    console.log('✅ Socket connected:', socket.id);
    
    // Authenticate user to join their room
    if (userId) {
      socket.emit('authenticate', userId);
      console.log('🔐 Authenticating user:', userId);
    }
  });

  socket.on('authenticated', (data) => {
    console.log('✅ Socket authenticated:', data);
  });

  socket.on('disconnect', (reason) => {
    console.log('❌ Socket disconnected:', reason);
  });

  socket.on('reconnect', (attemptNumber) => {
    console.log(`🔄 Socket reconnected after ${attemptNumber} attempts`);
    if (userId) {
      socket.emit('authenticate', userId);
    }
  });

  socket.on('connect_error', (error) => {
    console.error('❌ Socket connection error:', error.message);
  });

  return socket;
};

/**
 * Disconnect the socket connection
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('🔌 Socket disconnected manually');
  }
};

/**
 * Get the current socket instance
 * @returns {Socket|null} The socket instance or null
 */
export const getSocket = () => socket;

/**
 * Emit an event to the server
 * @param {string} eventName - Name of the event
 * @param {any} data - Data to send
 */
export const emitEvent = (eventName, data) => {
  if (socket?.connected) {
    socket.emit(eventName, data);
    console.log(`📤 Emitted event: ${eventName}`, data);
  } else {
    console.warn('⚠️ Cannot emit event, socket not connected');
  }
};

export default {
  initSocket,
  disconnectSocket,
  getSocket,
  emitEvent,
};