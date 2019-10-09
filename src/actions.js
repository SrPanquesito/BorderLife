const conexion = require('./conexion');

const isDefined = (obj) => {
    if (typeof obj == "undefined") {
      return false;
    }
    if (!obj) {
      return false;
    }
    return obj != null;
  }

exports.handleApiAiAction = (sender, action, responseText, contexts, parameters, payload) => {
    
    // ---------------------------------- ACTION FUNCTIONS (Direct dialog) ----------------------------------
    if (payload === "") {

      switch (action) {
    
      case "input.welcome":
          var imgUrl = "https://scontent.ftij3-1.fna.fbcdn.net/v/t1.0-9/26112397_1995779794024131_2635074728864296031_n.png?_nc_cat=101&_nc_eui2=AeGlk0P1hn-zxVFW8SQ6R9IT1xwXhPQrfX5sb2K8s_Oxlykdga3V0GmkgWB3IzvrniPwStXQcshFa6EuHyWwspuP3JT7Qj3tAo5LEc-FR7abRQ&_nc_oc=AQmsM3PpwZnuoHYc4Se5v-YeEI3CNUF3jjLzS8gUHyd_fGxON6WB7WeG0Cf32JDrJGA&_nc_ht=scontent.ftij3-1.fna&oh=bd83d7cb76fa447c9d3bb99847680558&oe=5E30E1A0";
          sendImageMessage(sender, imgUrl)
            .then(() => {
              conexion.sendTextMessage(sender, responseText)
                .then(() => {
                  var responseText = "¿Vas a cruzar en carro o caminando?"
                  var replies = [
                  {
                      "content_type": "text",
                      "title": "Carro",
                      "payload": "",
                      "image_url": "https://img.icons8.com/plasticine/2x/car.png"
                  },
                  {
                      "content_type": "text",
                      "title": "Caminando",
                      "payload": "",
                      "image_url": "https://cdn3.iconfinder.com/data/icons/diet-flat/64/running-people-man-diet-nutrition-512.png"
                  }
                  ];
                  sendQuickReply(sender, responseText, replies)
                });
            });
      break;

      case "input.cruzar.garita":
          conexion.sendTextMessage(sender, responseText)
            .then(() => {
              var responseText = "¿Vas a cruzar en carro o caminando?"
              var replies = [
              {
                  "content_type": "text",
                  "title": "Carro",
                  "payload": "",
              },
              {
                  "content_type": "text",
                  "title": "Caminando",
                  "payload": "",
              }
              ];
              sendQuickReply(sender, responseText, replies)
            });
      break;

      case "input.caminando":
          var responseText = "¿Por donde quieres cruzar caminando?";
          var replies = [
          {
              "content_type": "text",
              "title": "San Ysidro",
              "payload": "san-ysidro-caminando"
          }, {
              "content_type": "text",
              "title": "Otay",
              "payload": "otay-caminando"
          }, {
              "content_type": "text",
              "title": "Tecate",
              "payload": "tecate-caminando"
          } ,{
              "content_type": "text",
              "title": "Calexico East",
              "payload": "calexico-east-caminando"
          }, {
              "content_type": "text",
              "title": "Calexico West",
              "payload": "calexico-west-caminando"
          },
          ];
          sendQuickReply(sender, responseText, replies)
      break;

      case "input.carro":
          var responseText = "¿Por donde quieres cruzar en carro?";
          var replies = [
          {
              "content_type": "text",
              "title": "San Ysidro",
              "payload": "san-ysidro-carro"
          }, {
              "content_type": "text",
              "title": "Otay",
              "payload": "otay-carro"
          }, {
              "content_type": "text",
              "title": "Tecate",
              "payload": "tecate-carro"
          } ,{
              "content_type": "text",
              "title": "Calexico East",
              "payload": "calexico-east-carro"
          }, {
              "content_type": "text",
              "title": "Calexico West",
              "payload": "calexico-west-carro"
          },
          ];
          sendQuickReply(sender, responseText, replies)
      break;

      // Envia mensaje generico
      case "send-text":
          var responseText = "This is example of Text message."
          conexion.sendTextMessage(sender, responseText);
      break;
      
      // Enviame imagen
      case "send-image":
          var imgUrl = "https://www.jacknifeprints.com/wp-content/uploads/2018/06/qotsa-20-send.jpg";
          sendImageMessage(sender, imgUrl);
      break;

      // Envia video
      case "send-media":
          const messageData = [
              {
                  "media_type": "video",
                  "url": "https://www.facebook.com/JoshHommeWorldwideFans/videos/1579947835628662/",
                  "buttons": [
                      {
                          "type": "web_url",
                          "url": "https://www.facebook.com/BeatHubMX/",
                          "title": "View Website",
                      }
                  ]
              }
          ]
          sendVideoMessage(sender, messageData);
      break;

      // Envia quick replies
      case "send-quick-reply":
          var responseText = "Choose the options"
          var replies = [{
              "content_type": "text",
              "title": "Example 1",
              "payload": "Example 1",
          },
          {
              "content_type": "text",
              "title": "Example 2",
              "payload": "Example 2",
          },
          {
              "content_type": "text",
              "title": "Example 3",
              "payload": "Example 3",
          }];
          sendQuickReply(sender, responseText, replies)
      break;

      // Envia carousel
      case "send-carousel" :
          var elements = [{
            "title": "Welcome!",
            "subtitle": "We have the right hat for everyone.We have the right hat for everyone.We have the right hat for everyone.",
            "imageUrl": "https://www.stepforwardmichigan.org/wp-content/uploads/2017/03/step-foward-fb-1200x628-house.jpg",
            "buttons": [
              {
                "postback": "https://f1948e04.ngrok.io",
                "text": "View Website"
              }, {
                "text": "Start Chatting",
                "postback": "PAYLOAD EXAMPLE"
              }
            ]
          }, {
            "title": "Welcome!",
            "imageUrl": "https://www.stepforwardmichigan.org/wp-content/uploads/2017/03/step-foward-fb-1200x628-house.jpg",
            "subtitle": "We have the right hat for everyone.We have the right hat for everyone.We have the right hat for everyone.",
            "buttons": [
              {
                "postback": "https://f1948e04.ngrok.io",
                "text": "View Website"
              }, {
                "text": "Start Chatting",
                "postback": "PAYLOAD EXAMPLE"
              }
            ]
          },{
            "title": "Welcome!",
            "imageUrl": "https://www.stepforwardmichigan.org/wp-content/uploads/2017/03/step-foward-fb-1200x628-house.jpg",
            "subtitle": "We have the right hat for everyone.We have the right hat for everyone.We have the right hat for everyone.",
            "buttons": [
              {
                "postback": "https://f1948e04.ngrok.io",
                "text": "View Website"
              }, {
                "text": "Start Chatting",
                "postback": "PAYLOAD EXAMPLE"
              }
            ]
          }];
          handleCardMessages(elements, sender)
      break;

      // Envia boton
      case "send-button":
          var responseText = "exmple buttons";
          var elements = [{
              "type": "web_url",
              "url": "https://f1948e04.ngrok.io",
              "title": "URL",
          }, {
              "type": "postback",
              "title": "POSTBACK",
              "payload": "POSTBACK TEST"
          }, {
              "type": "phone_number",
              "title": "CALL",
              "payload": "+919510733999"
          }];
          sendButtonMessage(sender, responseText, elements)
      break;

      // Envia recibo
      case "send-receipt":
          const recipient_name = "Nikhil Savaliya";
          const currency = "INR";
          const payment_method = "Visa 2345";
          const timestamp = 1428444852;
          const elementRec = [{
              "title": "Classic Blue T-Shirt",
              "subtitle": "100% Soft and Luxurious Cotton",
              "quantity": 1,
              "price": 350,
              "currency": "INR",
              "image_url": "http://pngimg.com/uploads/tshirt/tshirt_PNG5450.png"
          }];
          const address = {
              "street_1": "A-6, First Floor",
              "street_2": "Safal Profitaire,",
              "city": "Ahmedabad",
              "postal_code": "380015",
              "state": "Gujarat",
              "country": "IN"
          };
          const summary = {
              "subtotal": 350.00,
              "shipping_cost": 4.95,
              "total_tax": 6.19,
              "total_cost": 361.14
          };
          const adjustments = [
              {
                  "name": "New Customer Discount",
                  "amount": 20
              },
              {
                  "name": "$10 Off Coupon",
                  "amount": 10
              }
          ];
          const order_url = "https://37cf1e51.ngrok.io"
          sendReceiptMessage(sender,
              recipient_name,
              currency,
              payment_method,
              timestamp,
              elementRec,
              address,
              summary,
              adjustments,
              order_url);
      break;

        default:
          //unhandled action, just send back the text
          conexion.sendTextMessage(sender, responseText);
      } // End switch (action)
    }

    // ---------------------------------- PAYLOAD FUNCTIONS (Buttons dialog) ----------------------------------
    else // Then payload has a value
    {
      switch (payload) {
        case "san-ysidro-caminando":
            var responseText = "Estos son los tiempos por San Ysidro..."
            conexion.sendTextMessage(sender, responseText);
          break;
        case "otay-caminando":
            var responseText = "Estos son los tiempos por Otay..."
            conexion.sendTextMessage(sender, responseText);
          break;
        case "tecate-caminando":
            var responseText = "Estos son los tiempos por Tecate..."
            conexion.sendTextMessage(sender, responseText);
          break;
        case "calexico-east-caminando":
            var responseText = "Estos son los tiempos por Calexico East..."
            conexion.sendTextMessage(sender, responseText);
          break;
        case "calexico-west-caminando":
            var responseText = "Estos son los tiempos por Calexico West..."
            conexion.sendTextMessage(sender, responseText);
          break;
        

        case "san-ysidro-carro":
            var responseText = "Estos son los tiempos por San Ysidro..."
            conexion.sendTextMessage(sender, responseText);
          break;
        case "otay-carro":
            var responseText = "Estos son los tiempos por Otay..."
            conexion.sendTextMessage(sender, responseText);
          break;
        case "tecate-carro":
            var responseText = "Estos son los tiempos por Tecate..."
            conexion.sendTextMessage(sender, responseText);
          break;
        case "calexico-east-carro":
            var responseText = "Estos son los tiempos por Calexico East..."
            conexion.sendTextMessage(sender, responseText);
          break;
        case "calexico-west-carro":
            var responseText = "Estos son los tiempos por Calexico West..."
            conexion.sendTextMessage(sender, responseText);
          break;
      
        default:
          //unhandled action, just send back the text
          conexion.sendTextMessage(sender, responseText);
          break;
      }
    }



  } // End function


















/* --------------- FUNCIONES MAGICAS --------------- */
// Funciones que hacen la magia ~ (Estructuran los mensajes al formato JSON y los envian al Messenger API)
const sendImageMessage = async (recipientId, imageUrl) => {
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
        await conexion.callSendAPI(messageData);
  }

  const sendVideoMessage = async (recipientId, elements) => {
    const messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        attachment: {
          type: "template",
          payload: {
            template_type: "media",
            elements: elements
          }
        }
      }
    };
        await conexion.callSendAPI(messageData)
  }

  const sendQuickReply = async (recipientId, text, replies, metadata) => {
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        text: text,
        metadata: isDefined(metadata) ? metadata : "",
        quick_replies: replies
      }
    };
        await conexion.callSendAPI(messageData);
  }

  async function handleCardMessages(messages, sender) {
    let elements = [];
    for (var m = 0; m < messages.length; m++) {
      let message = messages[m];
      let buttons = [];
      for (var b = 0; b < message.buttons.length; b++) {
        let isLink = message.buttons[b].postback.substring(0, 4) === "http";
        let button;
        if (isLink) {
          button = {
            type: "web_url",
            title: message.buttons[b].text,
            url: message.buttons[b].postback
          };
        } else {
          button = {
            type: "postback",
            title: message.buttons[b].text,
            payload: message.buttons[b].postback
          };
        }
        buttons.push(button);
      }
      let element = {
        title: message.title,
        image_url: message.imageUrl,
        subtitle: message.subtitle,
        buttons: buttons
      };
      elements.push(element);
    }
    await sendGenericMessage(sender, elements);
  }

  const sendGenericMessage = async (recipientId, elements) => {
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        attachment: {
          type: "template",
          payload: {
            template_type: "generic",
            elements: elements
          }
        }
      }
    };
    await conexion.callSendAPI(messageData);
  }

  const sendButtonMessage = async (recipientId, text, buttons) => {
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        attachment: {
          type: "template",
          payload: {
            template_type: "button",
            text: text,
            buttons: buttons
          }
        }
      }
    };
    await conexion.callSendAPI(messageData);
  }

  const sendReceiptMessage = async (
    recipientId,
    recipient_name,
    currency,
    payment_method,
    timestamp,
    elements,
    address,
    summary,
    adjustments,
    order_url
   ) => {
    var receiptId = "order" + Math.floor(Math.random() * 1000);
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        attachment: {
          type: "template",
          payload: {
            template_type: "receipt",
            recipient_name: recipient_name,
            order_number: receiptId,
            currency: currency,
            payment_method: payment_method,
            order_url: order_url,
            timestamp: timestamp,
            address: address,
            summary: summary,
            adjustments: adjustments,
            elements: elements,
          }
        }
      }
    };
    await conexion.callSendAPI(messageData);
  }