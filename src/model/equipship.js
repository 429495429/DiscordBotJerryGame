const { Schema, model } = require('mongoose');

const equipshipSchema = new Schema({
    ownerId:{
        type: String,
        require: true,
    },
    rodId:{
        type: String,
        require: true,
    },
})

module.exports = model('Equipship', equipshipSchema);