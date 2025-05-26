import { createServer } from 'http';

const server = createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
});

server.listen(7000, '0.0.0.0', () => {
  console.log('Server running at http://localhost:7000/');
});