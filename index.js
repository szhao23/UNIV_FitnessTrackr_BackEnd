require('dotenv').config();
const express = require('express');
const server = express();
const morgan = require('morgan');
const chalk = require('chalk');
const cors = require('cors');
const {PORT = 3000} = process.env;


const { client } = require('./db');
client.connect();

server.use(cors());


// logging middleware
server.use(morgan('dev'));
// parsing middleware
server.use(express.json());
server.use(express.urlencoded({extended: true}));

// API Router here
server.use('/api', require('./api'));

// error handling middleware
server.use((error, req, res, next) => {
  console.error('SERVER ERROR: error');
  res.send(error);
})
server.listen(PORT, () => {
  console.log(chalk.blueBright('Server is listening on PORT:'), chalk.yellow(PORT), chalk.blueBright('Get your routine on!'));
});
