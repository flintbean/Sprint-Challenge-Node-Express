const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');

const apiRoutes = require('./data/routers/apiRoutes');

const server = express();

server.use(express.json());
server.use(morgan('combined'));
server.use(helmet());

server.use('/api', apiRoutes);

server.listen(8000, () => console.log('API running on port 8000... *.*'));