function onError(error) {
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error('requires elevated privileges, closing the app');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error('Port is already in use, closing the app');
      process.exit(1);
      break;
    default:
      console.error('An unexpected error occured while starting the server');
  }
}

module.exports = { onError };
