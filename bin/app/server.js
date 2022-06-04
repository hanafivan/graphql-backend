const express = require('express');
const {graphqlExpress, graphiqlExpress} = require ('graphql-server-express');
const cors = require('cors');
const {init} = require('../modules/graphql');
const bodyParser = require('body-parser');

function AppServer() {
  this.server = express();
  this.server.use(cors());
  this.server.use('/graphql', bodyParser.json(), graphqlExpress(init()));
  this.server.use('/grapihql', graphiqlExpress({
    endpointURL: '/graphql'
  }))
}

module.exports = AppServer;