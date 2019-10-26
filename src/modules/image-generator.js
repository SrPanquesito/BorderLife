const { createCanvas } = require('canvas')
const canvas = createCanvas(1200, 628)
const ctx = canvas.getContext('2d')

var urls = [];

exports.generate = async (text) => {

    for (var i = 0; i < text.length; i++) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.globalAlpha = 1
        ctx.font = 'normal 90px Verdana, serif'

        // Create gradient
        grd = ctx.createLinearGradient(146, 0, 600, 628);

        // Add colors
        grd.addColorStop(0.227, 'rgba(112, 0, 112, 1.000)');
        grd.addColorStop(0.593, 'rgba(61, 0, 137, 1.000)');
        grd.addColorStop(1.000, 'rgba(51, 0, 109, 1.000)');

        // Fill with gradient
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, 1200, 628);

        ctx.translate(canvas.width / 2, canvas.height / 2);

        ctx.textAlign = "center";

        ctx.strokeStyle = '#000'
        ctx.strokeText(text[i], -2, -2)

        ctx.fillStyle = '#cecece'
        ctx.fillText(text[i], 0, 0)


        var base64Data = canvas.toDataURL().replace(/^data:image\/png;base64,/, "");

        await require("fs").writeFile("public/tiempo_temp_"+ (i+1) +".png", base64Data, 'base64', function(err) {
            if(isNaN(err)) console.log(err);
        });
        // urls.push("https://a330365b.ngrok.io/tiempo_temp_"+ (i+1) + ".png");
        urls.push("https://digital-lab-chatbot.herokuapp.com/tiempo_temp_"+ (i+1) + ".png");
    }

    return urls;
}