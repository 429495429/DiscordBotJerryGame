const { Schema, model } = require('mongoose');

const rodSchema = new Schema({
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
    sellprice:{
        type: Number,
        default: 0,
    },
    ownerId:{
        type: String,
        require: true,
    },
    reinforce:{
        type: Number,
        default: 0,
    }
})

module.exports = model('Rod', rodSchema);