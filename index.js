require('dotenv').config({ path: './variables.env' });
const { MONGODB_CONNECTION } = process.env;
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Set Route Components
const webhook = require('./src/webhook');
const userRoutes = require('./src/db/routes/userInteraction');

const app = express();

//setting Port
app.set('port', process.env.PORT || 5000);

//serve static files in the public directory
app.use(express.static('public'));

// ---HEADERS---
/*  
-    Process application/json
-    Process application/x-www-form-urlencoded
-    Set CORS permissions. 
*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
  
// Fetch Routes
app.get('/', function (req, res) {
  res.send("Hello world, I am a chat bot");
});
app.get('/webhook', webhook.getMessage);
app.post('/webhook', webhook.postMessage);
app.use('/user', userRoutes);

// Error handling
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({message: message, data: data});
});

// Spin up the server
mongoose
  .connect('mongodb+srv://' + MONGODB_CONNECTION, { useNewUrlParser: true,  useUnifiedTopology: true })
    .then(result => {
      // Spin up the server
        app.listen(app.get("port"), () => {
          console.log("Magic Started on port", app.get("port"));
        });
    })
    .catch(err => console.log(err));