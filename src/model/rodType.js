const { Schema, model } = require('mongoose');

const rodTypeSchema = new Schema({
    rodname:{
        type: String,
        require: true,
    },
    rare0rate:{
        type: Number,
        default: 1,
    },
    rare1rate:{
        type: Number,
        default: 1,
    },
    rare2rate:{
        type: Number,
        default: 1,
    },
    rare3rate:{
        type: Number,
        default: 0,
    },
    rare4rate:{
        type: Number,
        default: 0,
    },
    rare5rate:{
        type: Number,
        default: 0,
    },
    basictime:{
        type: Number,
        default: 0,
    },
    shopcost:{
        type: Number,
        default: 0,
    }
})

module.exports = model('RodType', rodTypeSchema);