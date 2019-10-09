require('dotenv').config({ path: './variables.env' });
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

// Route Components
const webhook = require('./src/webhook');

//setting Port
app.set("port", process.env.PORT || 4000);

//serve static files in the public directory
app.use(express.static("public"));

// ---HEADERS---
// Process application/x-www-form-urlencoded
// Process application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get("/", function (req, res) {
  res.send("Hello world, I am a chat bot");
});
app.get("/webhook/", webhook.getMessage);
app.post("/webhook/", webhook.postMessage);

// Spin up the server
app.listen(app.get("port"), function () {
  console.log("Magic Started on port", app.get("port"));
});
