import { Server } from 'socket.io';

export const initiateSocket = (server: any) => {
  const io = new Server(server);

  io.on('connection', (socket: any) => {
    console.log('Connected client on port %s.', process.env.PORT);

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  return io;
};
