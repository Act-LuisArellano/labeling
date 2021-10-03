const {Schema, model} = require('mongoose');

const LabelSchema = new Schema({
    date: {type: Date, default: Date.now},
    id_user: {type: String},
    id_ejemplo: {type: String},
    robo: {type: Boolean},
    homicidio: {type: Boolean},
    secuestro: {type: Boolean},
    violencia: {type: Boolean},
    d_sexual: {type: Boolean},
    d_organizada: {type: Boolean},
    narcotrafico: {type: Boolean},
    suicidio: {type: Boolean},
    accidente: {type: Boolean},
    ninguno: {type: Boolean},
    representacion_grafica: {type: Boolean}
});

module.exports = model('Label', LabelSchema);
