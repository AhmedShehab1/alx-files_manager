const express = require('express');

const server = express();
const PORT = process.env.PORT || 5000;
const router = require('./routes/index');

server.use(express.json());
server.use('/', router);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
