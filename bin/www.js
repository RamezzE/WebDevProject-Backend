// Desc: This file is the entry point for the application. 
// It is responsible for setting up an HTTP server and listening for connections on the port specified in the configuration.

/**
 * Module dependencies.
 */

import app from '../app.js';

import { createServer } from 'http';

import dotenv from 'dotenv';
dotenv.config({ path: './.env' })

import mongoose from "mongoose";

/**
 * Get port from environment and store in Express.
 */

const PORT = (process.env.PORT);
const HOST = (process.env.HOST);
app.set('port', PORT);
app.set('host', HOST);
app.set('env', process.env.ENV);


/**
 * Create HTTP server.
 */

const server = createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    server.listen(PORT);
    server.on('error', onError);
    server.on('listening', onListening);
    console.log(`Server running at http://${HOST}:${PORT}/`);
  })
  .catch((error) => {
    console.log(error)
  })

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = 'Port ' + PORT;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = 'Port ' + addr.port;
  console.log('Listening on ' + bind);
}