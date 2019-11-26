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
          responseText = "Mi nombre es Don Púas de Border Life y quiero ayudarte hoy para que tu cruce fronterizo sea más sencillo.";
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
            responseText = "Mi nombre es Don Púas de Border Life y quiero ayudarte hoy para que tu cruce fronterizo sea más sencillo.";
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
            var responseText = "Hola! Soy Don Púas de Border Life y estoy para ayudarte a que tu vida en la frontera sea más fácil para ahorrar tiempo y dinero. Por el momento te puedo ayudar con el cruce de garitas. Escribe “Cuanta fila hay” y verás como te doy información.";
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
          "imageUrl": "https://lh3.googleusercontent.com/ohEQGGTmmJRlfE7nbMKiZzCRjxwcKqB54c6GVZ5jsvdO1Ws4JWeomZkCBOhxYt95ktt7dH4wkqzUIiSXAF45h_TaiAP2l1fMDK7quJ60KBnRRoUVk-JMqXN4hzaNFzYLXKPa2pN2GFxB2UA-kTO306lRvteaDXI24D8w08PFRSL8hqXFiDMGRZC-r4ZTgCZ3fXh40J1E_kOkdQcdsixLo4cL3I5UoLKkXcVOBL4CWs6QfPrfafbMqPf2xvVKpmqiHQT4iOFAl7Kw5LtPQV8AK2FVmMtR2L3m9IJ9sAO-ZjfXZkvQuqyqLF4TXUkP1vlsTlJCCoaIaJs-WfgvbFLgvtatRMCWtsuwzlAGVKYmGkEM3RJVXmEJSm931KlIMHU91aX6Q-nqmsrmMU3rQMpXM9y0fI7TrUNvcce6VlIB23LdWR8YOJDYhZw4v4YFrVN0IsXQ38PSSBKJxysPp3RP3gb6_v87BTqf0n4BFwXEEMHYs3mtRpDoalVM_w3M6Q0Bh1HN_NY6y1esoTPeScksPBnjhfiF25x6m42GbMxYfutHLxDxN8iVRc5YfUByZnb5o_x-wuHBTN2tSxcS0cHUbsEuY6zHGjzGy-8BH9_Z6HQPKrpUCPYajqp3eZVtPbrlK1mzc0gTUf_OW5eIIHomiZ7kWxTlyiRKW4x_EerQyL140zEi8I8jLBE=w1200-h628-no",
          "buttons": [
            {
              "text":"Messenger",
              "postback":"https://m.me/275725219861393",
            }
          ]
        },{
          "title": "Abogados Now",
          "subtitle": 'https://www.facebook.com/Border-Life-110042407068232/?ref=br_rs',
          "imageUrl": "https://lh3.googleusercontent.com/XpDPXlzLIrV6elxe2blc9h2fu5DmLpagEDkDqbBmHCzWgrj1_aaPh7gYxIeECo22KXzhKu7EQhKdWlOR9hvJ075725TPPjiK7oMUKqv98OcgPWjDE60jt5oMnm4rGrJ7WyHCMxuw-dhhe4t2Kxh1o5SNc16Pn-yms2IRPqHkTslXJPQxypL039iUUVs4CaAbjml9uwvYOZirTWfXkIKZahH3bGjEabKuz8o-AVBcWJ23AqCShDUMHHLGSsz--QU5x2Z5LmvARRUPbhMRgj9xwweYC6RYiiQFAd7LHqalLwddSL7tNgUXbER33UWGaVJm4AR8eWil4kCoztZMbIAv74reFfNVrN7vkNiRpHyzBpCfymhTEwzPZxV7aHHsJNDl4eKMo_g9Gwf_aIJsH-HPGx9yJSutLuc1UbpzN6kCd66rBbSAeCm864zXgdUx_F-g_Q1CgL7SHhULVn_EfW33CkwVBQnbHJeTygnir3WCs-vpBbyfKVnfJo7g8p2DOM-tXIiynXfXGAIxgMGaQ09iBmUIBof7goQ2gWhBWPAIA8EVc8-IIjVbntBjxv0enue4zcUTFLezsPs_AC8yoxpTV-5-m1njPZ-O3lh3AaRtbEOUCeyGCNAVPq5rx5lBmHjyQ4kAEs4Y5fvETlWq1gd0DT6-wlQwHU53mmnOm5xf6Uh-UekvH58kszQ=w1200-h628-no",
          "buttons": [
            {
              "text":"Whatsapp",
              "postback":"https://wa.me/526645017536",
            }
          ]
        },{
          "title": "Abogados Now",
          "subtitle": 'https://www.facebook.com/Border-Life-110042407068232/?ref=br_rs',
          "imageUrl": "https://lh3.googleusercontent.com/An89bRuQmAMpqxrV5WP2n1AekkIjyvJrcA-v2M18aTFIvbWgrMHYt6ac8MHksoDXAQ7PTMWTNPhk2A4kVPUriyWbW8R06Gw0rcIPl5Rw1bdzbNRnblAsSS8YVtZcgY5XQLEYH-NqS9j_sAaVdxeeIKpFUMBaRcaPP8h3HmxjJB7RJECY5201WyMUqO6z89-cgp-d_supf1Nsar17-I-klL34OlSEHZLeJIj39JM830ctRRpyrdq1DSx2530BEAGefnGMJ5j0XLo0w74jo0Mg9ThAtFJ3we54MS0uph9fuphrdnXpkeFz9agJsPOM2S3ZIQ3tYiPWmCftDUcqbGUc3QaY3fVpMheVaWvZvMoXbNa7X6w3nwv8u_-vquu-cAm6KTRDHVa79GCAKuM2Mw9Kl0R3gb6P4N3M6QG8Tn_ECZi1rrWEXYpO6EGO1X3miOTM6EfqS5JF3Rauc-_LB57R5e4PW_igY9YKAISgjB5fwvheT11L9CRAyB_k-ZOhi_dI_T-Y3-WTIqU00oHDDO_xbyiUKVgfwACCKYU5dPxFA5jii26v6ovnCJ7rBLCG0e3HXgoI0IOTRK9QRqJPMv30XwM4ZUHUlrcyUKrw_ufqvxS7A2AXGXCKUS8Pv7GH_KLGAUlxLyhoVcQ_T0WG8naF9XSs6g11OdPTRMIV3I-Rkq6bApDLqAaa6To=w810-h450-no",
          "buttons": [
            {
              "text":"Messenger",
              "postback":"https://m.me/275725219861393",
            }
          ]
        },{
          "title": "Abogados Now",
          "subtitle": 'https://www.facebook.com/Border-Life-110042407068232/?ref=br_rs',
          "imageUrl": "https://lh3.googleusercontent.com/tgjJtm_urKirAZcrVji0ddgrGaSr89SSROlLCFjQobiLXJgRyLNwg6v_lNQZTyCzKpisVpgRyCaZW08skxaVDsdUbUfW7cVD6pqXkkPqsdZ3wiB3_L899wryRUl9etZMVSmW-VoBH3VkuENTfimWzUQ1mNbE5fRlU9LLyNlBlSrAsfwzfxVgNsTlDzwrN57S1MRNwFYZUvLy1IQoHM9iHYibMJASL_lLeF7pr4zpBlJzfDvQXhmqYEz3f6WIKLrJkCkTpKpPNEqgHuOmJeGA0XfPg2oQgs_UxJHkpFHia-TdOsmyWsxLBXkgwpSUgrePO6TKJR4AIeY5smQ93YPiGkionSKv9Ev3_WR0Cny4m85nEhX_vsglfLtdURRyX3c3EflWUibqhKnR1HWbM4jxyLY73fjmtCLWMdvuuJ2r8MxXaVtmi2M34m0eF6e21vZN1-PLShjTqaXHYOpXqm73_sZrwU7xUtT4O3Q9Gv9b3G_2m-X-ceA1Om_8miMTWrEzu_6hewFkfS82uEuDDgDMHl9Ap1BxxgFRumkpEvMch8FlMeZ4lKR1Y6JoVcpf8qo3s_cjT8JAaEpNa9rKpgsceIoakgN6elC7gZdCdrSVeWQ-kP2FuTbrE0eGWb6A4nZccLXVHV6ZJ84GxHGmHpLXZ0k9TQh7WOr1WgXyh-Pu2OV0t0QsdHq15d4=w1343-h757-no",
          "buttons": [
            {
              "text":"Whatsapp",
              "postback":"https://wa.me/526645017536",
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