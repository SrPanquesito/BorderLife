const conexion = require('./conexion');
const scrape = require('./modules/webscrapping');
const canvas = require('./modules/image-generator');
const fs = require('fs');

const userController = require('./db/controllers/userInteraction');

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

      // Asesoria Legal
      case "input.asesoria.legal":
          var responseText = "Pues mira, tengo un par de amigos perfectos para ti.\nTe protegerán a capa y espada y estarán contigo durante todo el proceso.🛡️";
          conexion.sendTextMessage(sender, responseText).then(res => {
            var elements = [
              {
                "title": "Abogados ;) [Nombre de firma]",
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
              handleCardMessages(elements, sender)
          }).catch();
      break;

      // Envia mensaje generico
      case "send-text":
          var responseText = "This is example of Text message."
          conexion.sendTextMessage(sender, responseText)
            .then(async res => {
              var txt = await conexion.getProfileInfo(sender);
              console.log(txt);
            })
            .catch();
      break;
      
      // Enviame imagen
      case "send-image":
          canvas.generate(['Cerrado', 'Abierto', 'N/A'])
            .then(async (imgUrls) => {
              for (var i = 0; i < imgUrls.length; i++) {
                await conexion.sendImageMessage(sender, imgUrls[i]);
                // Delete local generated image
                var deleteUrl = imgUrls[i].substring(imgUrls[i].indexOf(".io/") + 4)
                fs.unlink('public/' + deleteUrl, (err) => {
                  if (err) throw err;
                  console.log('public/' + deleteUrl + ' was deleted');
                });
              }
              // If we want to upload to FB API
              //conexion.uploadImage(sender, imgUrls).then().catch();
            })
            .catch(err => console.log(err));
      break;

      // Envia video
      case "send-media":
          const messageData = [
              {
                  "media_type": "video",
                  "url": "https://www.facebook.com/JoshHommeWorldwideFans/videos/1579947835628662/",
                  "buttons": [
                    {
                      "type":"web_url",
                      "url":"https://digitallabagency.com/",
                      "title":"URL Button",
                      "webview_height_ratio": "full"
                    }
                  ]
              }
          ]
          sendVideoMessage(sender, messageData);
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
        case "no_gracias":
          var responseText = "Bueno... Pero que no se te olvide que estoy aquí para ti. \nPara cualquier cosa si necesitas un amigo robot 🤖, aquí estaré *24/7* \n Siempre contigo, siempre a tu lado, siempre observandoté 🙂";
          conexion.sendTextMessage(sender, responseText);
        break;
        case "asesoria.legal":
          var responseText = "Pues mira, tengo un par de amigos perfectos para ti.\nTe protegerán a capa y espada y estarán contigo durante todo el proceso.🛡️";
          conexion.sendTextMessage(sender, responseText).then(res => {
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
              handleCardMessages(elements, sender)
          }).catch();
        break;


        // Pedir garitas
        case "san-ysidro-caminando":
            scrape.cbp('san_ysidro', '', 'peatonal')
              .then(res => {
                if (res.standard === 'no delay') res.standard = 'SIN DEMORA';
                if (res.readylane === 'no delay') res.readylane = 'SIN DEMORA';
                var responseText = "🛂 *Cruce peatonal por San Ysidro* 🛃\n\nLinea estandar: *" + res.standard + "*\nReadylane: *" + res.readylane + "*";
                return conexion.sendTextMessage(sender, responseText);
              })
              .then(userInfo => {
                // Registra un nuevo usuario o aumenta contador webscrapping
                return userController.signupFB(sender);
              })
              .then(async userInfo => {
                if (userInfo.user.webscrapping_count % 3 === 0 && userInfo.user.webscrapping_count !== 0) {
                  // Enviar AD si son multiplos de 3 y es diferente de 0
                  await AD_Abogados(sender);
                }
              })
              .catch(err => console.log(err));
          break;
        case "otay-caminando":
            scrape.cbp('otay', 'Passenger', 'peatonal')
              .then(res => {
                if (res.standard === 'no delay') res.standard = 'SIN DEMORA';
                if (res.readylane === 'no delay') res.readylane = 'SIN DEMORA';
                var responseText = "🛂 *Cruce peatonal por Otay* 🛃\n\nLinea estandar: *" + res.standard + "*\nReadylane: *" + res.readylane + "*";
                return conexion.sendTextMessage(sender, responseText);
              })
              .then(res => {
                // Registra un nuevo usuario o aumenta contador webscrapping
                return userController.signupFB(sender);
              })
              .then(async userInfo => {
                if (userInfo.user.webscrapping_count % 3 === 0 && userInfo.user.webscrapping_count !== 0) {
                  // Enviar AD si son multiplos de 3 y es diferente de 0
                  await AD_Abogados(sender);
                }
              })
              .catch(err => console.log(err));
          break;
        case "tecate-caminando":
            scrape.cbp('tecate', '', 'peatonal')
              .then(res => {
                if (res.standard === 'no delay') res.standard = 'SIN DEMORA';
                if (res.readylane === 'no delay') res.readylane = 'SIN DEMORA';
                var responseText = "🛂 *Cruce peatonal por Tecate* 🛃\n\nLinea estandar: *" + res.standard + "*\nReadylane: *" + res.readylane + "*";
                return conexion.sendTextMessage(sender, responseText);
              })
              .then(res => {
                // Registra un nuevo usuario o aumenta contador webscrapping
                return userController.signupFB(sender);
              })
              .then(async userInfo => {
                if (userInfo.user.webscrapping_count % 3 === 0 && userInfo.user.webscrapping_count !== 0) {
                  // Enviar AD si son multiplos de 3 y es diferente de 0
                  await AD_Abogados(sender);
                }
              })
              .catch(err => console.log(err));
          break;
        case "calexico-east-caminando":
            scrape.cbp('mexicali', 'East', 'peatonal')
              .then(res => {
                if (res.standard === 'no delay') res.standard = 'SIN DEMORA';
                if (res.readylane === 'no delay') res.readylane = 'SIN DEMORA';
                var responseText = "🛂 *Cruce peatonal por Calexico East* 🛃\n\nLinea estandar: *" + res.standard + "*\nReadylane: *" + res.readylane + "*";
                return conexion.sendTextMessage(sender, responseText);
              })
              .then(res => {
                // Registra un nuevo usuario o aumenta contador webscrapping
                return userController.signupFB(sender);
              })
              .then(async userInfo => {
                if (userInfo.user.webscrapping_count % 3 === 0 && userInfo.user.webscrapping_count !== 0) {
                  // Enviar AD si son multiplos de 3 y es diferente de 0
                  await AD_Abogados(sender);
                }
              })
              .catch(err => console.log(err));
          break;
        case "calexico-west-caminando":
            scrape.cbp('mexicali', 'West', 'peatonal')
              .then(res => {
                if (res.standard === 'no delay') res.standard = 'SIN DEMORA';
                if (res.readylane === 'no delay') res.readylane = 'SIN DEMORA';
                var responseText = "🛂 *Cruce peatonal por Calexico West* 🛃\n\nLinea estandar: *" + res.standard + "*\nReadylane: *" + res.readylane + "*";
                return conexion.sendTextMessage(sender, responseText);
              })
              .then(res => {
                // Registra un nuevo usuario o aumenta contador webscrapping
                return userController.signupFB(sender);
              })
              .then(userInfo => {
                if (userInfo.user.webscrapping_count % 3 === 0 && userInfo.user.webscrapping_count !== 0) {
                  // Enviar AD si son multiplos de 3 y es diferente de 0
                  return AD_Abogados(sender);
                }
              })
              .then(res => {
                var responseText = "👨‍⚖️¿Cómo te has portado esta semana, necesitas un abogado para que defienda tus derechos?👩‍⚖️"
                var replies = [{
                    "content_type": "text",
                    "title": "Quiero ayuda legal",
                    "payload": "asesoria.legal",
                },
                {
                    "content_type": "text",
                    "title": "No, gracias",
                    "payload": "no_gracias",
                }];
                sendQuickReply(sender, responseText, replies)
              })
              .catch(err => console.log(err));
          break;
        

        case "san-ysidro-carro":
            var urlsToDelete = [];
            var times = [];
            // Webscrapping info/tiempos de garitas...
            scrape.cbp('san_ysidro', '', 'carro')
              .then(async (res) => {
                if (res.standard === 'no delay') res.standard = 'SIN DEMORA';
                if (res.readylane === 'no delay') res.readylane = 'SIN DEMORA';
                if (res.sentri === 'no delay') res.sentri = 'SIN DEMORA';
                
                times.push(res.standard, res.readylane, res.sentri);
                // Crea las imagenes c/ tiempos de garitas
                return await canvas.generate([res.standard, res.readylane, res.sentri])
              })
              .then(async (imgUrls) => {
                // Prepara estructura del carrousel
                urlsToDelete = imgUrls;
                var elements = [{
                  "title": "Estandar vehícular: ",
                  "subtitle": 'Info: U.S. Customs and Border Protection https://www.cbp.gov/',
                  "imageUrl": imgUrls[0],
                  "buttons": [
                    {
                      "text": times[0],
                      "postback": "PAYLOAD EXAMPLE"
                    }
                  ]
                },{
                  "title": "Readylane vehícular: ",
                  "subtitle": 'Info: U.S. Customs and Border Protection https://www.cbp.gov/',
                  "imageUrl": imgUrls[1],
                  "buttons": [
                    {
                      "text": times[1],
                      "postback": "PAYLOAD EXAMPLE"
                    }
                  ]
                },{
                  "title": "Sentri vehícular: ",
                  "subtitle": 'Info: U.S. Customs and Border Protection https://www.cbp.gov/',
                  "imageUrl": imgUrls[2],
                  "buttons": [
                    {
                      "text": times[2],
                      "postback": "PAYLOAD EXAMPLE"
                    }
                  ]
                }];
                // Envia carrousel
                return await handleCardMessages(elements, sender)
              })
              .then(carrouselRes => {
                // Delete images after sending the carrousel
                for (var i = 0; i < urlsToDelete.length; i++) {
                  // Change indexOf to '.com/' + 5 when deploying     '.io/' + 4 when dev
                  var deleteUrl = urlsToDelete[i].substring(urlsToDelete[i].indexOf(".com/") + 5)
                  fs.unlink('public/' + deleteUrl, (err) => {
                    if (err) throw err;
                    console.log('public/' + deleteUrl + ' was deleted');
                  });
                }

                // Send AD
                var responseText = "👨‍⚖️¿Cómo te has portado esta semana, necesitas un abogado para que defienda tus derechos?👩‍⚖️"
                var replies = [{
                    "content_type": "text",
                    "title": "Quiero ayuda legal",
                    "payload": "asesoria.legal",
                },
                {
                    "content_type": "text",
                    "title": "No, gracias",
                    "payload": "no_gracias",
                }];
                sendQuickReply(sender, responseText, replies)
              })
              .catch(err => console.log(err));
          break;

        case "otay-carro":
            scrape.cbp('otay', 'Passenger', 'carro')
              .then(res => {
                if (res.standard === 'no delay') res.standard = 'SIN DEMORA';
                if (res.readylane === 'no delay') res.readylane = 'SIN DEMORA';
                if (res.sentri === 'no delay') res.sentri = 'SIN DEMORA';
                var responseText = "🛂 *Cruce vehícular por Otay* 🛃\n\nLinea estandar: *" + res.standard + "*\nReadylane: *" + res.readylane + "*\nSentri: *" + res.sentri + "*";
                return conexion.sendTextMessage(sender, responseText);
              })
              .then(res => {
                // Registra un nuevo usuario o aumenta contador webscrapping
                return userController.signupFB(sender);
              })
              .then(async userInfo => {
                if (userInfo.user.webscrapping_count % 3 === 0 && userInfo.user.webscrapping_count !== 0) {
                  // Enviar AD si son multiplos de 3 y es diferente de 0
                  await AD_Abogados(sender);
                }
              })
              .catch(err => console.log(err));
          break;
        case "tecate-carro":
            scrape.cbp('tecate', '', 'carro')
              .then(res => {
                if (res.standard === 'no delay') res.standard = 'SIN DEMORA';
                if (res.readylane === 'no delay') res.readylane = 'SIN DEMORA';
                if (res.sentri === 'no delay') res.sentri = 'SIN DEMORA';
                var responseText = "🛂 *Cruce vehícular por Tecate* 🛃\n\nLinea estandar: *" + res.standard + "*\nReadylane: *" + res.readylane + "*\nSentri: *" + res.sentri + "*";
                return conexion.sendTextMessage(sender, responseText);
              })
              .then(res => {
                // Registra un nuevo usuario o aumenta contador webscrapping
                return userController.signupFB(sender);
              })
              .then(async userInfo => {
                if (userInfo.user.webscrapping_count % 3 === 0 && userInfo.user.webscrapping_count !== 0) {
                  // Enviar AD si son multiplos de 3 y es diferente de 0
                  await AD_Abogados(sender);
                }
              })
              .catch(err => console.log(err));
          break;
        case "calexico-east-carro":
            scrape.cbp('mexicali', 'East', 'carro')
              .then(res => {
                if (res.standard === 'no delay') res.standard = 'SIN DEMORA';
                if (res.readylane === 'no delay') res.readylane = 'SIN DEMORA';
                if (res.sentri === 'no delay') res.sentri = 'SIN DEMORA';
                var responseText = "🛂 *Cruce vehícular por Calexico East* 🛃\n\nLinea estandar: *" + res.standard + "*\nReadylane: *" + res.readylane + "*\nSentri: *" + res.sentri + "*";
                return conexion.sendTextMessage(sender, responseText);
              })
              .then(res => {
                // Registra un nuevo usuario o aumenta contador webscrapping
                return userController.signupFB(sender);
              })
              .then(async userInfo => {
                if (userInfo.user.webscrapping_count % 3 === 0 && userInfo.user.webscrapping_count !== 0) {
                  // Enviar AD si son multiplos de 3 y es diferente de 0
                  await AD_Abogados(sender);
                }
              })
              .catch(err => console.log(err));
          break;
        case "calexico-west-carro":
            scrape.cbp('mexicali', 'West', 'carro')
              .then(res => {
                if (res.standard === 'no delay') res.standard = 'SIN DEMORA';
                if (res.readylane === 'no delay') res.readylane = 'SIN DEMORA';
                if (res.sentri === 'no delay') res.sentri = 'SIN DEMORA';
                var responseText = "🛂 *Cruce vehícular por Calexico West* 🛃\n\nLinea estandar: *" + res.standard + "*\nReadylane: *" + res.readylane + "*\nSentri: *" + res.sentri + "*";
                return conexion.sendTextMessage(sender, responseText);
              })
              .then(res => {
                // Registra un nuevo usuario o aumenta contador webscrapping
                return userController.signupFB(sender);
              })
              .then(async userInfo => {
                if (userInfo.user.webscrapping_count % 3 === 0 && userInfo.user.webscrapping_count !== 0) {
                  // Enviar AD si son multiplos de 3 y es diferente de 0
                  await AD_Abogados(sender);
                }
              })
              .catch(err => console.log(err));
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
    .then(res => {
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
        handleCardMessages(elements, sender)
    })
    .catch();
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