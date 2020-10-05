require('dotenv').config();
const express = require('express');
const server = express();
const morgan = require('morgan');
const chalk = require('chalk');
const cors = require('cors');
const {PORT = 3000} = process.env;


const client = require('./db/client');
client.connect();

server.use(cors());


// logging middleware
server.use(morgan('dev'));
// parsing middleware
server.use(express.json());
server.use(express.urlencoded({extended: true}));

// Serve Docs
const path = require('path');
server.use('/docs', express.static(path.join(__dirname, 'public')));

// Router: /api
server.use('/api', require('./api'));

server.get('/', (req, res) => {
  res.redirect('/docs');
})

// error handling middleware
server.use((error, req, res, next) => {
  console.error('SERVER ERROR: ', error);
  res.send({error: error.message, ...error});
})
server.listen(PORT, () => {
  console.log(chalk.blueBright('Server is listening on PORT:'), chalk.yellow(PORT), chalk.blueBright('Get your routine on!'));
});
