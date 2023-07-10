const { Schema, model } = require('mongoose');

const fisherSchema = new Schema({
    userId:{
        type: String,
        require: true,
    },
    guildId:{
        type: String,
        require: true,
    },
    cash:{
        type: Number,
        default: 0,
    },
    lure:{
        type: Number,
        default: 0,
    },
    exp:{
        type: Number,
        default: 0,
    }
})

module.exports = model('Fisher', fisherSchema);