const mongoose = require('mongoose')

const scoreSchema = new mongoose.Schema({
    value:{
        type: String,
        required: true
    },
    playerName:{
        type: String,
        required: true
    }
})


module.exports = mongoose.model('Score', scoreSchema)