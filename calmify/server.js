const httpServer = require('http-server');
const path = require('path');

const server = httpServer.createServer({
  root: path.join(__dirname, 'calmify'),
  cache: -1,
  showDir: true,
  autoIndex: true,
});

server.listen(8001, () => {
  console.log('Server is running at http://localhost:8001');
});