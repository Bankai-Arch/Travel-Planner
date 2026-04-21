import { Server } from 'socket.io';
import { config } from './env';

export const initSocket = (httpServer: any) => {
  const io = new Server(httpServer, {
    cors: { origin: config.CLIENT_URL, methods: ['GET', 'POST'] }
  });

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    // Join a shared trip room
    socket.on('join-trip', (tripId: string) => {
      socket.join(tripId);
      socket.to(tripId).emit('user-joined', { socketId: socket.id });
    });

    // Broadcast itinerary changes to trip collaborators
    socket.on('update-itinerary', ({ tripId, update }) => {
      socket.to(tripId).emit('itinerary-updated', update);
    });

    // Broadcast cursor / active day selection
    socket.on('cursor-move', ({ tripId, day, userId }) => {
      socket.to(tripId).emit('cursor-updated', { day, userId });
    });

    socket.on('leave-trip', (tripId: string) => {
      socket.leave(tripId);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
    });
  });

  return io;
};
