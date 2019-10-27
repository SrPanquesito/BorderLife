const cheerio = require('cheerio');
const axios = require('axios');

/* -------------------------------- Customs and Border Protection --------------------------------
    Webscrapper para pagina de garitas: https://apps.cbp.gov/bwt/mobile.asp?action=n&pn=2506
    El parametro 'garita' se indicaran con mexicali, otay, san_ysidro y tecate
    Para 'garitaSub' se indicara SOLO en mexicali ('East', 'West') y en otay ('Passenger')
    Para 'cruce' se indicara si el tipo de cruce ('carro', 'peatonal')
*/
exports.cbp = async (garita, garitaSub, cruce) => {
    var json = {
        "standard": '',
        "readylane": '',
        "sentri": ''
    };

    switch (garita) {
        case 'mexicali':
            garita = '2503';
        break;
        case 'san_ysidro':
            garita = '2504';
        break;
        case 'tecate':
            garita = '2505';
        break;
        case 'otay':
            garita = '2506';
        break;
    
        default:
            garita = '2506';
            break;
    }
    
    switch (cruce) {
        case "carro":
            cruce = '.pass_details';
        break;
        case "peatonal":
            cruce = '.ped_details';
        break;
    
        default:
            break;
    }
    
    var busqueda = '.contain_head > b > i';
    if (garita === '2504' || garita === '2505') {
        busqueda = '.contain_head > b';
        if (garita === '2504') {
            garitaSub = 'San Ysidro';
        } else if (garita === '2505') {
            garitaSub = 'Tecate';
        }
    }

    const url = 'https://apps.cbp.gov/bwt/mobile.asp?action=n&pn=' + garita;

    console.log('Init webscrapping on: ' + url + ' // ' + garitaSub + ' // ' + cruce);
      return await axios.get(url)
        .then(html => {
            const $ = cheerio.load(html.data);

            $(busqueda).each((c, el) => {
                if($(el).text() === garitaSub) {
                    $(el).closest('header').siblings(cruce).children('i').each((c, el) => {
                        if ($(el).text().includes('Standard')) {
                            // Checks if there's time wait or lane is N/A
                            let timeWait = $(el).next('b').text();
                            if (/\S/.test( timeWait )) {
                                json.standard = timeWait;
                            } 
                            else {
                                json.standard = 'N/A';
                            }
                        }
                        else if ($(el).text().includes('Readylane')) {
                            // Checks if there's time wait or lane is N/A
                            let timeWait = $(el).next('b').text();
                            if (/\S/.test( timeWait )) {
                                json.readylane = timeWait;
                            } 
                            else {
                                json.readylane = 'N/A';
                            }
                        }
                        else if ($(el).text().includes('Sentri')) {
                            // Checks if there's time wait or lane is N/A
                            let timeWait = $(el).next('b').text();
                            if (/\S/.test( timeWait )) {
                                json.sentri = timeWait;
                            } 
                            else {
                                json.sentri = 'N/A';
                            }
                        }
                    });
                }
            });

            return json;
        })
        .catch(error => {
          console.log(error);
        });
}