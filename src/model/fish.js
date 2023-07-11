const { Schema, model } = require('mongoose');

const fishSchema = new Schema({
    fishname:{
        type: String,
        require: true,
    },
    length:{
        type: Number,
        default: 0,
    },
    ownerId:{
        type: String,
        require: true,
    },
    price:{
        type: Number,
        default: 0,
    }
})

module.exports = model('Fish', fishSchema);