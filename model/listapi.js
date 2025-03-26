const mongoose = require('mongoose');

const apiSchema = new mongoose.Schema({
    nama: {
        type: String,
        required: true,
    },
    kategori: {
        type: String,
        required: true,
    },
    premium: {
        type: String,
    },
    url: {
        type: String,
    },
    metode: {
        type: String,
    },
});

module.exports = mongoose.model('listApi', apiSchema);