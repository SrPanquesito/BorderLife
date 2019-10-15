const { FB_PAGE_TOKEN } = process.env;
const axios = require('axios');

const { createCanvas } = require('canvas')
const canvas = createCanvas(1200, 628)
const ctx = canvas.getContext('2d')



exports.generate = async (text) => {

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
    ctx.strokeText(text, -2, -2)

    ctx.fillStyle = '#cecece'
    ctx.fillText(text, 0, 0)



    // canvas.createPNGStream().pipe(require('fs').createWriteStream(require('path').join(__dirname, 'text.png')))
    return canvas.toDataURL();
}