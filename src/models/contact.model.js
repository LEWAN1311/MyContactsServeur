const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true, minlength: 10, maxlength: 20 },
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;