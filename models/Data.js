const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    index: {
        type: Number,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const Data = mongoose.model('Data', dataSchema);
module.exports = Data;
