const mongoose = require('mongoose');
const { Schema } = mongoose

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        index: {
            unique: true
        },
        required: true,
    },
    password: {
        type: String,
    },
    role: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    apikey: { 
        type: String 
    },
    limitApikey: {
         type: Number 
    },
});
schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
const user = mongoose.model('user', userSchema);
module.exports = user;