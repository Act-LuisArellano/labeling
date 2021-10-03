const {Schema, model} = require('mongoose');

const CardSchema = new Schema({
    description: {type: String},
    image_name: {type: String}
});

module.exports = model('Card', CardSchema);
