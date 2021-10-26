const {Schema, model} = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const CardSchema = new Schema({
    description: {type: String},
    image_name: {type: String}
});

CardSchema.plugin(mongoosePaginate);

module.exports = model('Card', CardSchema);
