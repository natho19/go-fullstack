const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Empêcher d'avoir plusieurs utilisateurs avec la même adresse email
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);