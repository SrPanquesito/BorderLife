const conexion = require('./conexion');
const scrape = require('./modules/webscrapping');
const canvas = require('./modules/image-generator');
const fs = require('fs');

const userController = require('./db/controllers/userInteraction');

function hasNumber(myString) {
  return /\d/.test(myString);
}

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
          conexion.sendImageMessage(sender, imgUrl)
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

      // Pide garita peatonal directamente por:
      case "input.caminando.sanysidro":
        crucePeatonal(sender, 'san_ysidro', '', 'San Ysidro');
      break;
      case "input.caminando.otay":
        crucePeatonal(sender, 'otay', 'Passenger', 'Otay');
      break;
      case "input.caminando.tecate":
        crucePeatonal(sender, 'tecate', '', 'Tecate');
      break;
      case "input.caminando.calexico.east":
        crucePeatonal(sender, 'mexicali_east', 'East', 'Calexico East');
      break;
      case "input.caminando.calexico.west":
        crucePeatonal(sender, 'mexicali_west', 'West', 'Calexico West');
      break;
      case "input.carro.sanysidro":
        cruceVehicular(sender, 'san_ysidro', '', 'San Ysidro');
      break;
      case "input.carro.otay":
        cruceVehicular(sender, 'otay', 'Passenger', 'Otay');
      break;
      case "input.carro.tecate":
        cruceVehicular(sender, 'tecate', '', 'Tecate');
      break;
      case "input.carro.calexico.east":
        cruceVehicular(sender, 'mexicali_east', 'East', 'Calexico East');
      break;
      case "input.carro.calexico.west":
        cruceVehicular(sender, 'mexicali_west', 'West', 'Calexico West');
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
        case "adInput.si":
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
      break;

      case "adInput.no":
          var responseText = "Ah, ok. Bye.";
          conexion.sendTextMessage(sender, responseText);
      break;

        // Pedir garitas
        case "san-ysidro-caminando":
            crucePeatonal(sender, 'san_ysidro', '', 'San Ysidro');
        break;
        case "otay-caminando":
            crucePeatonal(sender, 'otay', 'Passenger', 'Otay');
        break;
        case "tecate-caminando":
            crucePeatonal(sender, 'tecate', '', 'Tecate');
        break;
        case "calexico-east-caminando":
            crucePeatonal(sender, 'mexicali_east', 'East', 'Calexico East');
        break;
        case "calexico-west-caminando":
            crucePeatonal(sender, 'mexicali_west', 'West', 'Calexico West');
          break;
        

        case "san-ysidro-carro":
            cruceVehicular(sender, 'san_ysidro', '', 'San Ysidro');
        break;

        case "otay-carro":
            cruceVehicular(sender, 'otay', 'Passenger', 'Otay');
        break;
        case "tecate-carro":
            cruceVehicular(sender, 'tecate', '', 'Tecate');
          break;
        case "calexico-east-carro":
            cruceVehicular(sender, 'mexicali_east', 'East', 'Calexico East');
          break;
        case "calexico-west-carro":
            cruceVehicular(sender, 'mexicali_west', 'West', 'Calexico West');
          break;
      
        default:
          //unhandled action, just send back the text
          conexion.sendTextMessage(sender, responseText);
          break;
      }
    }



  } // End function



// -------- ADS --------
const AD_Abogados = async (sender) => {
  var responseText = "Si tienes problemas legales tengo un par de amigos perfectos para ti.\nTe protegerán a capa y espada y estarán contigo durante todo el proceso.🛡️";
  await conexion.sendTextMessage(sender, responseText)
    .then(async res => {
      var elements = [
        {
          "title": "Abogados [Nombre de firma]",
          "subtitle": 'https://www.facebook.com/Border-Life-110042407068232/?ref=br_rs',
          "imageUrl": "https://lh3.googleusercontent.com/otnd6JLGhvZa2O-mMO9M8nT2ZzVcbcO58NWw1U2h-5c25LpLjBVBwNXPoy0xpyTotBLiWRyfCj-jpSEHeTSLpD4XgDWS3LghNnbL967YBnEE8yrMDcyQz8j-1KkZVCxKdFXrhWpubQ=w1091-h571-no",
          "default_action": {
            "type": "web_url",
            "url": "https://digitallabagency.com/"
          },
          "buttons": [
            {
              "text":"Click para ver más",
              "postback":"https://digitallabagency.com/",
              "webview_height_ratio": "tall",
              "messenger_extensions": "true"
            }
          ]
        },{
          "title": "Abogados [Nombre de firma]",
          "subtitle": 'https://www.facebook.com/Border-Life-110042407068232/?ref=br_rs',
          "imageUrl":"https://lh3.googleusercontent.com/otnd6JLGhvZa2O-mMO9M8nT2ZzVcbcO58NWw1U2h-5c25LpLjBVBwNXPoy0xpyTotBLiWRyfCj-jpSEHeTSLpD4XgDWS3LghNnbL967YBnEE8yrMDcyQz8j-1KkZVCxKdFXrhWpubQ=w1091-h571-no",
          "default_action": {
            "type": "web_url",
            "url": "https://digitallabagency.com/"
          },
          "buttons": [
            {
              "text":"Click para ver más",
              "postback":"https://digitallabagency.com/",
              "webview_height_ratio": "tall",
              "messenger_extensions": "true"
            }
          ]
        }];
        await handleCardMessages(elements, sender)
    })
    .catch();

    var responseText = "http://abogadosnowusa.com/"
    await conexion.sendTextMessage(sender, responseText);
};




// Pide tiempos de garita
const cruceVehicular = async(sender, garita, garitaSub, message) => {
  // All json values must be in minutes to make operations
  var json1, json2, json3;
  var json = {
    'standard': '',
    'readylane': '',
    'sentri': ''
  };
  await scrape.cbp(garita, garitaSub, 'carro')
    .then(res => {
      // Change 'no delay' and 'N/A' to number 0 for mathematical operations
      if(!hasNumber(res.standard)) res.standard = 0;
      if(!hasNumber(res.readylane)) res.readylane = 0;
      if(!hasNumber(res.sentri)) res.sentri = 0;

      res.standard = parseInt(res.standard);
      res.readylane = parseInt(res.readylane);
      res.sentri = parseInt(res.sentri);

      json1 = res;
      console.log(res);
    })
    .catch(err => console.log(err));
  await scrape.pasosfronterizos(garita)
    .then(res => {
      var hourMinutes;

      // Change 'no delay' and 'N/A' to number 0 for mathematical operations
      if(!hasNumber(res.standard.vehicular)) { res.standard = 0; }
      else {
        // Convert hours to minutes and parse them as integers
        if(res.standard.vehicular.includes(':')) {
          hourMinutes = res.standard.vehicular.split(":");
          hourMinutes[0] = parseInt(hourMinutes[0]);
          hourMinutes[1] = parseInt(hourMinutes[1]);
          res.standard = (hourMinutes[0]*60) + hourMinutes[1];
        } else { res.standard = parseInt(res.standard.vehicular); }
      }

      // Change 'no delay' and 'N/A' to number 0 for mathematical operations
      if(!hasNumber(res.readylane.vehicular)) { res.readylane = 0; }
      else {
        // Convert hours to minutes and parse them as integers
        if(res.readylane.vehicular.includes(':')) {
          hourMinutes = res.readylane.vehicular.split(":");
          hourMinutes[0] = parseInt(hourMinutes[0]);
          hourMinutes[1] = parseInt(hourMinutes[1]);
          res.readylane = (hourMinutes[0]*60) + hourMinutes[1];
        } else { res.readylane = parseInt(res.readylane.vehicular); }
      }

      // Change 'no delay' and 'N/A' to number 0 for mathematical operations
      if(!hasNumber(res.sentri.vehicular)) { res.sentri = 0; }
      else {
        // Convert hours to minutes and parse them as integers
        if(res.sentri.vehicular.includes(':')) {
          hourMinutes = res.sentri.vehicular.split(":");
          hourMinutes[0] = parseInt(hourMinutes[0]);
          hourMinutes[1] = parseInt(hourMinutes[1]);
          res.sentri = (hourMinutes[0]*60) + hourMinutes[1];
        } else { res.sentri = parseInt(res.sentri.vehicular); }
      }

      json2 = res;
      console.log(res);
    })
    .catch(err => console.log(err));
    await scrape.garitasreporte(garita)
    .then(res => {
      var hourMinutes;

      // Change 'no delay' and 'N/A' to number 0 for mathematical operations
      if(!hasNumber(res.standard.vehicular)) { res.standard = 0; }
      else {
        // Convert hours to minutes and parse them as integers
        if(res.standard.vehicular.includes(':')) {
          hourMinutes = res.standard.vehicular.split(":");
          hourMinutes[0] = parseInt(hourMinutes[0]);
          hourMinutes[1] = parseInt(hourMinutes[1]);
          res.standard = (hourMinutes[0]*60) + hourMinutes[1];
        } else { res.standard = parseInt(res.standard.vehicular); }
      }

      // Change 'no delay' and 'N/A' to number 0 for mathematical operations
      if(!hasNumber(res.readylane.vehicular)) { res.readylane = 0; }
      else {
        // Convert hours to minutes and parse them as integers
        if(res.readylane.vehicular.includes(':')) {
          hourMinutes = res.readylane.vehicular.split(":");
          hourMinutes[0] = parseInt(hourMinutes[0]);
          hourMinutes[1] = parseInt(hourMinutes[1]);
          res.readylane = (hourMinutes[0]*60) + hourMinutes[1];
        } else { res.readylane = parseInt(res.readylane.vehicular); }
      }

      // Change 'no delay' and 'N/A' to number 0 for mathematical operations
      if(!hasNumber(res.sentri.vehicular)) { res.sentri = 0; }
      else {
        // Convert hours to minutes and parse them as integers
        if(res.sentri.vehicular.includes(':')) {
          hourMinutes = res.sentri.vehicular.split(":");
          hourMinutes[0] = parseInt(hourMinutes[0]);
          hourMinutes[1] = parseInt(hourMinutes[1]);
          res.sentri = (hourMinutes[0]*60) + hourMinutes[1];
        } else { res.sentri = parseInt(res.sentri.vehicular); }
      }

      json3 = res;
      console.log(res);
    })
    .catch(err => console.log(err));

  json.standard = Math.round((json1.standard + json2.standard + json3.standard) / 3);
  json.readylane = Math.round((json1.readylane + json2.readylane + json3.readylane) / 3);
  json.sentri = Math.round((json1.sentri + json2.sentri + json3.sentri) / 3);
  
  printCruce(sender, json, message, 'vehícular');
};

const crucePeatonal = async(sender, garita, garitaSub, message) => {
  // All json values must be in minutes to make operations
  var json1, json2, json3;
  var json = {
    'standard': '',
    'readylane': '',
    'sentri': ''
  };
  await scrape.cbp(garita, garitaSub, 'peatonal')
    .then(res => {
      // Change 'no delay' and 'N/A' to number 0 for mathematical operations
      if(!hasNumber(res.standard)) res.standard = 0;
      if(!hasNumber(res.readylane)) res.readylane = 0;
      if(!hasNumber(res.sentri)) res.sentri = 0;

      res.standard = parseInt(res.standard);
      res.readylane = parseInt(res.readylane);
      res.sentri = parseInt(res.sentri);

      json1 = res;
      console.log(res);
    })
    .catch(err => console.log(err));
  await scrape.pasosfronterizos(garita)
    .then(res => {
      var hourMinutes;
      
      // Change 'no delay' and 'N/A' to number 0 for mathematical operations
      if(!hasNumber(res.standard.peatonal)) { res.standard = 0; } 
      else {
        // Convert hours to minutes and parse them as integers
        if(res.standard.peatonal.includes(':')) {
          hourMinutes = res.standard.peatonal.split(":");
          hourMinutes[0] = parseInt(hourMinutes[0]);
          hourMinutes[1] = parseInt(hourMinutes[1]);
          res.standard = (hourMinutes[0]*60) + hourMinutes[1];
        } else { res.standard = parseInt(res.standard.peatonal); }
      }

      // Change 'no delay' and 'N/A' to number 0 for mathematical operations
      if(!hasNumber(res.readylane.peatonal)) { res.readylane = 0; }
      else {
        // Convert hours to minutes and parse them as integers
        if(res.readylane.peatonal.includes(':')) {
          hourMinutes = res.readylane.peatonal.split(":");
          hourMinutes[0] = parseInt(hourMinutes[0]);
          hourMinutes[1] = parseInt(hourMinutes[1]);
          res.readylane = (hourMinutes[0]*60) + hourMinutes[1];
        } else { res.readylane = parseInt(res.readylane.peatonal); }
      }

      // Change 'no delay' and 'N/A' to number 0 for mathematical operations
      if(!hasNumber(res.sentri.peatonal)) { res.sentri = 0; }
      else {
        // Convert hours to minutes and parse them as integers
        if(res.sentri.peatonal.includes(':')) {
          hourMinutes = res.sentri.peatonal.split(":");
          hourMinutes[0] = parseInt(hourMinutes[0]);
          hourMinutes[1] = parseInt(hourMinutes[1]);
          res.sentri = (hourMinutes[0]*60) + hourMinutes[1];
        } else { res.sentri = parseInt(res.sentri.peatonal); }
      }

      json2 = res;
      console.log(res);
    })
    .catch(err => console.log(err));
  await scrape.garitasreporte(garita)
  .then(res => {
      var hourMinutes;

      // Change 'no delay' and 'N/A' to number 0 for mathematical operations
      if(!hasNumber(res.standard.peatonal)) { res.standard = 0; }
      else {
        // Convert hours to minutes and parse them as integers
        if(res.standard.peatonal.includes(':')) {
          hourMinutes = res.standard.peatonal.split(":");
          hourMinutes[0] = parseInt(hourMinutes[0]);
          hourMinutes[1] = parseInt(hourMinutes[1]);
          res.standard = (hourMinutes[0]*60) + hourMinutes[1];
        } else { res.standard = parseInt(res.standard.peatonal); }
      }
      
      json3 = res;
      console.log(res);
    })
    .catch(err => console.log(err));

  json.standard = Math.round((json1.standard + json2.standard + json3.standard) / 3);
  json.readylane = Math.round((json1.readylane + json2.readylane + json3.standard) / 3);
  json.sentri = Math.round((json1.sentri + json2.sentri + json3.standard) / 3);
  
  printCruce(sender, json, message, 'peatonal');
};

const printCruce = async(sender, json, message, tipo) => {
  if (json.standard === 0) { json.standard = 'N/A'; } else { json.standard = json.standard + ' min'; }
  if (json.readylane === 0) { json.readylane = 'N/A'; } else { json.readylane = json.readylane + ' min'; }
  if (json.sentri === 0) { json.sentri = 'N/A'; } else { json.sentri = json.sentri + ' min'; }
  var responseText = "🛂 *Cruce " + tipo + " por "+ message +"* 🛃\n\nLinea estandar: *" + json.standard + "*\nReadylane: *" + json.readylane + "*\nSentri: *" + json.sentri + "*";
  await conexion.sendTextMessage(sender, responseText)
    .then(res => {
      // Registra un nuevo usuario o aumenta contador webscrapping
      return userController.signupFB(sender);
    })
    .then(async userInfo => {
      if (userInfo.user.webscrapping_count % 3 === 0 && userInfo.user.webscrapping_count !== 0) {
        // Enviar AD si son multiplos de 3 y es diferente de 0
        return AD_Abogados(sender);
      }
    })
    .catch(err => console.log(err));
};




/* --------------- CUSTOM DEVELOPMENT - FUNCIONES MAGICAS --------------- */
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
            url: message.buttons[b].postback,
            webview_height_ratio: "tall",
            messenger_extensions: "true"
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

      let element;
      if (message.default_action) {
        element = {
          title: message.title,
          image_url: message.imageUrl,
          subtitle: message.subtitle,
          default_action: {
            type: "web_url",
            url: message.default_action.url,
            webview_height_ratio: "tall",
            messenger_extensions: "true"
          },
          buttons: buttons
        };
      } else {
        element = {
          title: message.title,
          image_url: message.imageUrl,
          subtitle: message.subtitle,
          buttons: buttons
        };
      }
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