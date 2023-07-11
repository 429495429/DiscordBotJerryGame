const { Schema, model } = require('mongoose');

const fishTypeSchema = new Schema({
    fishtype:{
        type: String,
        require: true,
    },
    fishname:{
        type: String,
        require: true,
    },
    maxlength:{
        type: Number,
        default: 0,
    },
    minlength:{
        type: Number,
        default: 0,
    },
    rare:{
        type: Number,
        default: 1,
    },
    unitprice:{
        type: Number,
        default: 0,
    }
})

module.exports = model('FishType', fishTypeSchema);