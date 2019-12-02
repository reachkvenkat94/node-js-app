const http = require('http');                                               // Using HTTP library
const app = require('./app');                                               // Using app.js file

const port = 3001;                                                          // Using port 3001

const server = http.createServer(app);

server.listen(port);