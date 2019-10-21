const { API_AI_CLIENT_ACCESS_TOKEN, FB_PAGE_TOKEN } = process.env;
const fs = require('fs');
const apiai = require("apiai");
const axios = require('axios');
const uuid = require("uuid");

const sessionIds = new Map();

const apiAiService = apiai(API_AI_CLIENT_ACCESS_TOKEN, {
  language: "es",
  requestSource: "fb"
});

// Handle intents actions from Dialogflow
const actions = require('./actions');

exports.receivedMessage = (event) => {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfMessage = event.timestamp;
    var message = event.message;
  
    if (!sessionIds.has(senderID)) {
      sessionIds.set(senderID, uuid.v1());
    }
  
    var messageId = message.mid;
    var appId = message.app_id;
    var metadata = message.metadata;
  
    // You may get a text or attachment but not both
    var messageText = message.text;
    var messageAttachments = message.attachments;

    if(message.hasOwnProperty('quick_reply')) {
      var qkreply = message.quick_reply;
      if (qkreply.hasOwnProperty('payload')) {
        var payload = qkreply.payload;
      }
    } else {
      var payload = "";
    }
  
    if (messageText) {
      //send message to api.ai
      sendToApiAi(senderID, messageText, payload);
    } 
    // else if (messageAttachments) {
    //     handleMessageAttachments(messageAttachments, senderID);
    // }
  }

  exports.receivedPostback = (event) => {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfMessage = event.timestamp;
    var message = event.postback;
  
    if (!sessionIds.has(senderID)) {
      sessionIds.set(senderID, uuid.v1());
    }
  
    var messageId = message.mid;
    var appId = message.app_id;
    var metadata = message.metadata;
  
    // You may get a text or attachment but not both
    var messageText = message.title;
    var messageAttachments = message.attachments;


    if (message.hasOwnProperty('payload')) {
        var payload = message.payload;
    } else {
      var payload = "";
    }
  
    if (messageText) {
      //send message to api.ai
      sendToApiAi(senderID, messageText, payload);
    } 
  }

sendToApiAi = (sender, text, payload) => {
    sendTypingOn(sender);
    let apiaiRequest = apiAiService.textRequest(text, {
      sessionId: sessionIds.get(sender)
    });
   
    apiaiRequest.on("response", response => {
      if (isDefined(response.result)) {
        handleApiAiResponse(sender, response, payload);
      }
    });
   
    apiaiRequest.on("error", error => console.error(error));
    apiaiRequest.end();
  };
  
  
  
  /*
   * Turn typing indicator on
   *
   */
  const sendTypingOn = (recipientId) => {
    var messageData = {
      recipient: {
        id: recipientId
      },
      sender_action: "typing_on"
    };
    this.callSendAPI(messageData);
  }
  
  
  
  /*
   * Call the Send Messenger API. The message data goes in the body. If successful, we'll 
   * get the message id in a response 
   *
   */
exports.callSendAPI = async (messageData) => {
  
    const url = "https://graph.facebook.com/me/messages?access_token=" + FB_PAGE_TOKEN;
      await axios.post(url, messageData)
        .then(function (response) {
          if (response.status == 200) {
            var recipientId = response.data.recipient_id;
            var messageId = response.data.message_id;
            if (messageId) {
              console.log(
                "Successfully sent message with id %s to recipient %s",
                messageId,
                recipientId
              );
            } else {
              console.log(
                "Successfully called Send API for recipient %s",
                recipientId
              );
            }
          }
        })
        .catch(function (error) {
          console.log(error.response.headers);
        });
    };
  
  
    
  const isDefined = (obj) => {
    if (typeof obj == "undefined") {
      return false;
    }
    if (!obj) {
      return false;
    }
    return obj != null;
  }
  
  
  
  
  function handleApiAiResponse(sender, response, payload) {
    let responseText = response.result.fulfillment.speech;
    let responseData = response.result.fulfillment.data;
    let messages = response.result.fulfillment.messages;
    let action = response.result.action;
    let contexts = response.result.contexts;
    let parameters = response.result.parameters;
  
    sendTypingOff(sender);
  
   if (responseText == "" && !isDefined(action)) {
      //api ai could not evaluate input.
      console.log("Unknown query" + response.result.resolvedQuery);
      this.sendTextMessage(
        sender,
        "I'm not sure what you want. Can you be more specific?"
      );
    } else if (isDefined(action)) {
      console.log(action);
      actions.handleApiAiAction(sender, action, responseText, contexts, parameters, payload);
    } else if (isDefined(responseData) && isDefined(responseData.facebook)) {
      try {
        console.log("Response as formatted message" + responseData.facebook);
        this.sendTextMessage(sender, responseData.facebook);
      } catch (err) {
        this.sendTextMessage(sender, err.message);
      }
    } else if (isDefined(responseText)) {
      this.sendTextMessage(sender, responseText);
    }
  }
  
  
  
  
  /*
   * Turn typing indicator off
   *
   */
  const sendTypingOff = (recipientId) => {
    var messageData = {
      recipient: {
        id: recipientId
      },
      sender_action: "typing_off"
    };
  
    this.callSendAPI(messageData);
  }
  
  
exports.sendTextMessage = async (recipientId, text) => {
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        text: text
      }
    };
    await this.callSendAPI(messageData);
  };







exports.sendImageMessage = async (recipientId, imageUrl, attchId) => {
  // If it has an attachment ID it's because we generated a local image
  if(!isNaN(attchId)) {
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        attachment: {
          type: "image",
          payload: {
            attachment_id: attchId
          }
        }
      }
    };
  }
  // If it doesn't, it's because we're sending an external URL image
  else {
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        attachment: {
          type: "image",
          payload: {
            url: imageUrl
          }
        }
      }
    };
  }
    await this.callSendAPI(messageData);
};





// UPLOAD IMAGE TO FACEBOOK API instead of hosting it locally
exports.sendImgAPI = async (recipientId, messageData) => {
  const url = "https://graph.facebook.com/me/message_attachments?access_token=" + FB_PAGE_TOKEN;
    await axios.post(url, messageData)
      .then(function (response) {
        if (response.status == 200) {
          if (response.hasOwnProperty('data')) {
            return response.data.attachment_id;
          }
        }
      })
      .then(res => {
        console.log(res);
        this.sendImageMessage(recipientId, 'whatever_imageURL', res);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

exports.uploadImage = async (recipientId, imageUrls) => {
  for (var i = 0; i < imageUrls.length; i++) {
    var messageData = {
      message: {
        attachment: {
          type: "image",
          payload: {
            is_reusable: true,
            url: imageUrls[i]
          }
        }
      }
    };
    await this.sendImgAPI(recipientId, messageData);
    // Delete local generated image
    var deleteUrl = imageUrls[i].substring(imageUrls[i].indexOf(".io/") + 4)
    fs.unlink('public/' + deleteUrl, (err) => {
      if (err) throw err;
      console.log('public/' + deleteUrl + ' was deleted');
    });
  }
};





//   exports.sendImgAPI = async (formData) => {
//     const url = "https://graph.facebook.com/v4.0/me/message_attachments?access_token=" + FB_PAGE_TOKEN;
//       await axios({
//           method: 'post',
//           url: url,
//           data: formData,
//           config: { headers: {'Content-Type': 'multipart/form-data' }}
//         })
//         .then(function (response) {
//           console.log(response);
//         })
//         .catch(function (error) {
//           console.log(error.response.headers);
//         });
//     };

// exports.uploadImage = async (recipientId, url) => {
//   var form = new FormData();
//   form.append('message', '{"attachment":{"type":"image", "payload":{"is_reusable":true}}}');
//   form.append('filedata', '@/src/example.jpg;type=image/jpg');

//   console.log(form);
//   // var url = "https://graph.facebook.com/v4.0/me/message_attachments?access_token=" + FB_PAGE_TOKEN;
//   // form.submit(url, function(err, res) {
//   //   console.log(res);
//   // });
//   await this.sendImgAPI(form);
// };