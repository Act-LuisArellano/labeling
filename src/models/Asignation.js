const {Schema, model} = require('mongoose');

const AsignationSchema = new Schema({
    ids_ejemplo: {type: String},
});

module.exports = model('Asignation', AsignationSchema);
