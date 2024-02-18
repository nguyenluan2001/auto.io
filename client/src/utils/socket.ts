import socketIOClient from 'socket.io-client';

const END_POINT = 'http://localhost:3000';
const socket = socketIOClient(END_POINT);
export { socket };
