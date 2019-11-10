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
        case 'mexicali_east':
            garita = '2503';
        break;
        case 'mexicali_west':
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

/*
    Webscrapper para pagina de garitas: https://pasosfronterizos.com/
    El parametro 'garita' se indicaran con mexicali_east || west, otay, san_ysidro y tecate
*/
exports.pasosfronterizos = async (garita) => {
    var json = {
        "standard": {
            "vehicular": '',
            "peatonal": ''
        },
        "readylane": {
            "vehicular": '',
            "peatonal": ''
        },
        "sentri": {
            "vehicular": '',
            "peatonal": ''
        }
    };
    var i = 0, vehicular, peatonal, waitTime, arr = [];
    
    switch (garita) {
        case 'mexicali_east':
            garita = 'garitas-mexicali-calexico-east.php';
        break;
        case 'mexicali_west':
            garita = 'garitas-mexicali-centro-calexico-west.php';
        break;
        case 'san_ysidro':
            garita = 'garitas-tijuana-san-ysidro.php';
        break;
        case 'tecate':
            garita = 'garitas-tecate.php';
        break;
        case 'otay':
            garita = 'garitas-otay-tijuana.php';
        break;
    
        default:
            break;
    }
    
    const url = 'https://pasosfronterizos.com/' + garita;

    return await axios.get(url)
        .then(html => {
        //success!
        const $ = cheerio.load(html.data);

        var x = $('.price').html();

            $('.price').each((c, el) => {
                
                if($(el).children('.header').text().includes('Cotizaciones')) {}
                else {
                    vehicular = $(el).children('.header').next().next();
                    peatonal = $(el).children('.header').next().next().next();

                    // Si hay texto en el span que contiene los tiempos de espera
                    waitTime = $(vehicular).children('span');
                    if ( /\S/.test((waitTime).text()) ) {
                        //console.log($(waitTime).next().next().text() );
                        if(/\S/.test($(waitTime).next().next().next().text()) ) {
                            arr[i] = $(waitTime).next().next().text()+':'+$(waitTime).next().next().next().text();
                        } else {
                            arr[i] = $(waitTime).next().next().text();
                        }
                    } else {
                        arr[i] = 'N/A';
                    }
                    i++;
                    waitTime = $(peatonal).children('span');
                    if ( /\S/.test((waitTime).text()) ) {
                        //console.log($(waitTime).next().next().text() );
                        if (/\S/.test($(waitTime).next().next().text())) {
                            arr[i] = $(waitTime).next().next().text();
                        } else {
                            arr[i] = 'Sin demoras';
                        }
                        
                    } else {
                        arr[i] = 'N/A';
                    }
                    i++;
                }
            })

            json.standard.vehicular = arr[0];
            json.standard.peatonal = arr[1];
            json.sentri.vehicular = arr[2];
            json.sentri.peatonal = arr[3];
            json.readylane.vehicular = arr[4];
            json.readylane.peatonal = arr[5];

            return json;

        })
        .catch(err => {
            console.log(err);
        });
}


/*
    Webscrapper para pagina de garitas: https://garitasreporte.com/
    El parametro 'garita' se indicaran con mexicali_east || west, otay, san_ysidro y tecate
*/
exports.garitasreporte = async (garita) => {
    var sub;
    var json = {
        "standard": {
            "vehicular": '',
            "peatonal": ''
        },
        "readylane": {
            "vehicular": ''
        },
        "sentri": {
            "vehicular": ''
        }
    };
    switch (garita) {
        case 'mexicali_east':
            sub = 0;
            garita = 'mexicali-calexico.php';
        break;
        case 'mexicali_west':
            sub = 1;
            garita = 'mexicali-calexico.php';
        break;
        case 'san_ysidro':
            sub = 0;
            garita = 'tijuana-san-ysidro-otay.php';
        break;
        case 'tecate':
            sub = 0;
            garita = 'tecate.php';
        break;
        case 'otay':
            sub = 2;
            garita = 'tijuana-san-ysidro-otay.php';
        break;
    
        default:
            break;
    }

    const url = 'https://garitasreporte.com/garitas/reporte/' + garita;

    return await axios.get(url)
        .then(html => {
            //success!
            const $ = cheerio.load(html.data);
            $('table > tbody > tr').each((c, el) => {
                // Retrieve table from page sub-section
                if(c === sub) {
                    json.standard.vehicular = $(el).children('.carrilNormalTiempo').text();
                    json.readylane.vehicular = $(el).children('.carrilReadyLaneTiempo').text();
                    json.sentri.vehicular = $(el).children('.carrilSentriTiempo').text();
                    json.standard.peatonal = $(el).children('.peatonalTiempo').text();
                }
            });
            return json;
        })
        .catch(err => {
            console.log(err);
        });
}