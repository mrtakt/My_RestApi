const mongoose = require('mongoose');

const apiSchema = new mongoose.Schema({
    kategori: {
        type: String,
        required: true,
    },
    premium: {
        type: String,
        required: true,
    },
    url: {
        type: String,
    },
    metode: {
        type: String,
    },
});

module.exports = mongoose.model('listapi', apiSchema);