/* eslint-disable no-console */
import 'dotenv/config';
import 'reflect-metadata';
import { createServer } from 'http';
import app from './application';
import { initiateSocket } from './common/socket-io';

const server = createServer(app);
initiateSocket(server);
const { PORT, HOST } = process.env;

server.listen(PORT, () => {
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  console.log(`Server running on ${HOST}:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server gracefully...');
  server.close(() => {
    console.log('Server shut down.');
    process.exit(0);
  });
});

// Error handling
process.on('uncaughtException', err => {
  console.error('Uncaught exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection:', reason);
  process.exit(1);
});
