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

exports.handleApiAiAction = async (sender, action, responseText, contexts, parameters, payload) => {
    
    // ---------------------------------- ACTION FUNCTIONS (Direct dialog) ----------------------------------
    if (payload === "") {

      switch (action) {
    
      case "input.welcome":
          var imgUrl = "https://scontent.ftij3-1.fna.fbcdn.net/v/t1.0-9/p960x960/78082459_145552473517225_5912040294173376512_o.png?_nc_cat=111&_nc_ohc=P2IiJnfoa-UAQkf8JIBT9RQO5v6W1WDucsMzZylgAHQsbJh6eg80Nf25w&_nc_ht=scontent.ftij3-1.fna&oh=5638fbc749fc66a98065ceb620515deb&oe=5E4DA384";
          await conexion.sendImageMessage(sender, imgUrl);
          
          var userInfo = await conexion.getProfileInfo(sender);
          var responseText = "Hola " + userInfo.first_name + ". Gracias por escribirnos.";
          await conexion.sendTextMessage(sender, responseText);
          responseText = "Bienvenido a Border Life. Queremos ayudarte para que tu cruce fronterizo sea más sencillo.";
          await conexion.sendTextMessage(sender, responseText);
          
          responseText = "¿Por donde quieres cruzar?"
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
          await sendQuickReply(sender, responseText, replies);
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
          var responseText = "¿Por cual garita quieres cruzar caminando?";
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
          var responseText = "¿Por cual garita quieres cruzar en carro?";
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
        case "welcome.getStarted":
            var imgUrl = "https://scontent.ftij3-1.fna.fbcdn.net/v/t1.0-9/p960x960/78082459_145552473517225_5912040294173376512_o.png?_nc_cat=111&_nc_ohc=P2IiJnfoa-UAQkf8JIBT9RQO5v6W1WDucsMzZylgAHQsbJh6eg80Nf25w&_nc_ht=scontent.ftij3-1.fna&oh=5638fbc749fc66a98065ceb620515deb&oe=5E4DA384";
            await conexion.sendImageMessage(sender, imgUrl);
            
            var userInfo = await conexion.getProfileInfo(sender);
            var responseText = "Hola " + userInfo.first_name + ". Gracias por escribirnos.";
            await conexion.sendTextMessage(sender, responseText);
            responseText = "Bienvenido a Border Life. Queremos ayudarte para que tu cruce fronterizo sea más sencillo.";
            await conexion.sendTextMessage(sender, responseText);
            
            responseText = "¿Por donde quieres cruzar?"
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
            await sendQuickReply(sender, responseText, replies);
        break;

        case "cruzarGarita.persistentMenu":
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

        case "quienesSomos.persistentMenu":
            var responseText = "Hola! Somos Border Life y estamos para ayudarte a que tu vida en la frontera sea más fácil para ahorrar tiempo y dinero. Por el momento te puedo ayudar con el cruce de garitas. Escribe “Cuanta fila hay” y verás como te doy información.";
            await conexion.sendTextMessage(sender, responseText);
        break;

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
  var responseText = "Te recuerdo que si trabajas en Estados Unidos y has tenido recientemente un accidente de auto o trabajo, tal vez has sufrido de un despido injustificado, te podemos ayudar a obtener tus beneficios de manera gratuita.\nContáctalos!";
  await conexion.sendTextMessage(sender, responseText)
    .then(async res => {
      var elements = [
        {
          "title": "Abogados Now",
          "subtitle": 'https://www.facebook.com/Border-Life-110042407068232/?ref=br_rs',
          "imageUrl": "https://live.staticflickr.com/65535/49280804367_9f87c1b912_b.jpg",
          "buttons": [
            {
              "text":"Messenger",
              "postback":"https://digitallab.link/BLAds2",
            }
          ]
        },{
          "title": "Abogados Now",
          "subtitle": 'https://www.facebook.com/Border-Life-110042407068232/?ref=br_rs',
          "imageUrl": "https://live.staticflickr.com/65535/49280595786_c78f7a1e8c_b.jpg",
          "buttons": [
            {
              "text":"Whatsapp",
              "postback":"https://digitallab.link/BLAds3",
            }
          ]
        }];
        await handleCardMessages(elements, sender)
    })
    .catch();

    var responseText = "http://abogadosnowusa.com/"
    await conexion.sendTextMessage(sender, responseText);
};


const AD_SeguroAutos = async (sender) => {
  var responseText = "Te recuerdo que si tu auto tiene placas de California y quieres un seguro con el que ahorres dinero, conoce Borderless, la única aseguranza con cobertura binacional.";
  await conexion.sendTextMessage(sender, responseText)
    .then(async res => {
      var elements = [
        {
          "title": "Borderless",
          "subtitle": 'https://www.facebook.com/Border-Life-110042407068232/?ref=br_rs',
          "imageUrl": "https://live.staticflickr.com/65535/49284926526_dd49f52944_b.jpg",
          "buttons": [
            {
              "text":"Conócelos",
              "postback":"https://digitallab.link/BLAds1",
            }
          ]
        }];
        await handleCardMessages(elements, sender)
    })
    .catch();

    var responseText = "https://digitallab.link/BLAds1"
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
  
  printCruceTest(sender, json, message, 'vehícular');
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
  
  printCruceTest(sender, json, message, 'peatonal');
};

const printCruceTest = async(sender, json, message, tipo) => {
  console.log(json.standard + "---" + json.readylane + "---" + json.sentri);
  var standard = json.standard != 0 ? (Math.ceil((json.standard)/5)*5) : "0";
  var readylane = json.readylane != 0 ? (Math.ceil((json.readylane)/5)*5) : "0";
  var sentri = json.sentri != 0 ? (Math.ceil((json.sentri)/5)*5) : "0";
  var elements = [
    {
      "title": "Estandar " + tipo + ": " + message,
      "subtitle": "El tiempo real de la garita sin manipular es: " + json.standard + " minutos.\nCalculamos el tiempo estimado promediando entre fuentes de informacion distintas.",
      "imageUrl": "https://cutt.ly/borderLife-minutos-" + standard,
      "buttons": [
        {
          "text": "Aprox: " + standard + " mins",
          "postback":"postbackdefault",
        }
      ]
    },{
      "title": "Readylane " + tipo + ": " + message,
      "subtitle": "El tiempo real de la garita sin manipular es: " + json.readylane + " minutos.",
      "imageUrl": "https://cutt.ly/borderLife-minutos-" + readylane,
      "buttons": [
        {
          "text": "Aprox: " + readylane + " mins",
          "postback":"postbackdefault",
        }
      ]
    },{
      "title": "Sentri " + tipo + ": " + message,
      "subtitle": "El tiempo real de la garita sin manipular es: " + json.sentri + " minutos.",
      "imageUrl": "https://cutt.ly/borderLife-minutos-" + sentri,
      "buttons": [
        {
          "text": "Aprox: " + sentri + " mins",
          "postback":"postbackdefault",
        }
      ]
    }];
    await handleCardMessages(elements, sender)
    .then(res => {
      // Registra un nuevo usuario o aumenta contador webscrapping
      return userController.signupFB(sender);
    })
    .then(async userInfo => {
      if (userInfo.user.webscrapping_count === 1) 
      {
        responseText = "Espero que haya podido ayudarte " + userInfo.user.first_name + ".\n\nRecuerda que cuando gustes puedes volver a revisar el tiempo de la línea por Messenger, o si gustas te puedo mandar una notificación por email cuando no haya fila en tu garita favorita.";
        var replies = [
          {
              "content_type": "text",
              "title": "Guardar garita favorita",
              "payload": ""
          },
          {
              "content_type": "text",
              "title": "Lo consulto despues",
              "payload": ""
          }
        ];
        await sendQuickReply(sender, responseText, replies);
      }
      if (userInfo.user.webscrapping_count % 6 === 0 && userInfo.user.webscrapping_count !== 0) {
        return AD_SeguroAutos(sender);
      }
      else if (userInfo.user.webscrapping_count % 3 === 0 && userInfo.user.webscrapping_count !== 0) {
        // Enviar AD si son multiplos de 3 y es diferente de 0
        return AD_Abogados(sender);
      }
    })
    .catch(err => console.log(err));
};

const printCruce = async(sender, json, message, tipo) => {
  console.log(json.standard + "---" + json.readylane + "---" + json.sentri);
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
      if (userInfo.user.webscrapping_count === 1) 
      {
        responseText = "Espero que haya podido ayudarte " + userInfo.user.first_name + ".\n\nRecuerda que cuando gustes puedes volver a revisar el tiempo de la línea por Messenger, o si gustas te puedo mandar una notificación por email cuando no haya fila en tu garita favorita.";
        var replies = [
          {
              "content_type": "text",
              "title": "Guardar garita favorita",
              "payload": ""
          },
          {
              "content_type": "text",
              "title": "Lo consulto despues",
              "payload": ""
          }
        ];
        await sendQuickReply(sender, responseText, replies);
      }
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
        /* 
          Si esta definida la extension, el tamaño del webview y el url como HTTP significa que
          el boton regresa un Webview
        */
        if (isLink && isDefined(message.buttons[b].webview_height_ratio) && isDefined(message.buttons[b].messenger_extensions)) {
          button = {
            type: "web_url",
            title: message.buttons[b].text,
            url: message.buttons[b].postback,
            webview_height_ratio: "tall",
            messenger_extensions: "true"
          };
        }
        // Boton regresara un link
        else if (isLink) {
          button = {
            type: "web_url",
            title: message.buttons[b].text,
            url: message.buttons[b].postback,
          };
        }
        // Boton regresara postback
        else {
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
        // Si esta definido la extension y el tamaño del webview, renderiza un Webview
        if (isDefined(message.default_action.webview_height_ratio) && isDefined(message.default_action.messenger_extensions)) 
        {
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
        }
        // Si no, entonces es un URL
        else 
        {
          element = {
            title: message.title,
            image_url: message.imageUrl,
            subtitle: message.subtitle,
            default_action: {
              type: "web_url",
              url: message.default_action.url
            },
            buttons: buttons
          };
        }
      }
      else {
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