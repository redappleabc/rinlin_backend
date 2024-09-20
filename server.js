const express = require("express");
const path = require("path");
const { Configuration, OpenAIApi } = require("openai");
const bodyParser = require('body-parser')
const cors = require("cors");
require('dotenv').config();
const app = express();
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const server = require('http').createServer(app);
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });
// const io = socketio(server);
var corsOptions = {
  origin: "*" 
};


app.use(cors(corsOptions));

const db = require("./app/models");

db.sequelize.sync({alter: true}) //{ force: true }  >>>> drop the table if it already exists
  .then(() => {
    console.log("Synced db.");
    // seeder
    // const categorySeeder = require('./app/seeder/category.seeder');
    // categorySeeder();
    // const reasonSeeder = require('./app/seeder/reason.seeder');
    // reasonSeeder();
    // const introductionSeeder = require('./app/seeder/introduction.seeder');
    // introductionSeeder();
    // const sendnotification = require('./app/seeder/notification.seeder');
    // sendnotification();
    
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

// simple route
app.use(express.static('uploads'))

app.get("/", (req, res) => {
  res.json({message: `Server running on port ${PORT}`})
});

var webSockets = {};
wss.on('connection', (ws, req) => {
  console.log('Client connected');
  var userId = req.url.substr(1);
  webSockets[userId] = ws;
  
  // Listen for messages from the client
  ws.on('message', (message) => {
    var messageData = JSON.parse(message)
    console.log('Received:', messageData.userId);
    var boardws = webSockets[messageData.userId];
    if (boardws) {
      boardws.send(JSON.stringify(messageData))
    }
  });

  // Handle client disconnection
  ws.on('close', () => {
    var userId = req.url.substr(1);
    delete webSockets[userId]; 
    console.log("User Disconnected: " + userId);
  });
});

console.log('WebSocket server is running on ws://localhost:8080');

require("./app/routes/auth.routes")(app);
require("./app/routes/group.routes")(app);
require("./app/routes/records.routes")(app);
require("./app/routes/like.routes")(app);
require("./app/routes/block.routes")(app);
require("./app/routes/post.routes")(app);
require("./app/routes/matching.routes")(app);
require("./app/routes/notification.routes")(app);
app.use("/api/upload", require('./app/routes/upload.routes'));

// set port, listen for requests
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

