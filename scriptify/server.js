const httpServer = require('http-server');
const path = require('path');

const server = httpServer.createServer({
  root: path.join(__dirname, 'scriptify'),
  cache: -1,
  showDir: true,
  autoIndex: true,
});

server.listen(8000, () => {
  console.log('Server is running at http://localhost:8000');
});