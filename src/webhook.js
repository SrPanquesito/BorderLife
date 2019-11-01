const { FB_VERIFY_TOKEN } = process.env;

// Logic for Messenger and Dialogflow conexion
const conexionApi = require('./conexion');

exports.getMessage = (req, res) => {
    console.log("request");
    if (
      req.query["hub.mode"] === "subscribe" &&
      req.query["hub.verify_token"] === FB_VERIFY_TOKEN
    ) {
      res.status(200).send(req.query["hub.challenge"]);
    } else {
      const error = new Error('Failed validation. Make sure the validation tokens match.');
      error.statusCode = 403;
      throw error;
    }
};

exports.postMessage = (req, res) => {
    var data = req.body;
    console.log(data);
    // Make sure this is a page subscription
    if (data.object == "page") {
      // Iterate over each entry
      // There may be multiple if batched
      data.entry.forEach(function (pageEntry) {
        var pageID = pageEntry.id;
        var timeOfEvent = pageEntry.time;
   
        // Iterate over each messaging event
        pageEntry.messaging.forEach(function (messagingEvent) {
          console.log(messagingEvent);
          if (messagingEvent.message) {
            conexionApi.receivedMessage(messagingEvent);
          } else if (messagingEvent.postback) {
            conexionApi.receivedPostback(messagingEvent);
          } 
          else {
            console.log("Webhook received unknown messagingEvent: ",messagingEvent);
          }
        });
      });
      // Assume all went well.
      // You must send back a 200, within 20 seconds
      res.sendStatus(200);
    }
};