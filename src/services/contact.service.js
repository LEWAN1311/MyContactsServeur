const Contact = require('../models/contact.model');

// Validation: phone must be 10–20 characters
const isValidPhone = (phone) => {
    if (typeof phone !== 'string') return false;
    const len = phone.trim().length;
    return len >= 10 && len <= 20;
};

const getContactsByIds = async (userId) => {
    const contacts = await Contact.find({ userId }).lean();
    return contacts;
}

const create = async (userId, data) => {
    const { firstName, lastName, phone } = data || {};
    if (!userId) {
        return { ok: false, status: 400, message: "userId is required" };
    }
    if (!firstName || !lastName || !phone) {
        return { ok: false, status: 400, message: "firstName, lastName and phone are required" };
    }
    if (!isValidPhone(phone)) {
        return { ok: false, status: 400, message: "phone must be 10-20 characters" };
    }

    const contact = await Contact.create({ userId, firstName, lastName, phone });
    return { ok: true, contact };
}

const updateContactById = async (id, dto) => {
    if (dto.phone !== undefined && !isValidPhone(dto.phone)) {
        return { ok: false, status: 400, message: "phone must be 10-20 characters" };
    }

    const contact = await Contact.findOneAndUpdate(
        { _id: id },
        { $set: dto },
        { new: true }
    );

    if (!contact) {
        return { ok: false, status: 404, message: "Contact not found" };
    }

    return { ok: true, contact };
}

const deleteContactById = async (id) =>{
    const result = await Contact.findOneAndDelete({ _id: id });

    if (!result) {
        return { ok: false, status: 404, message: "Contact not found" };
    }

    return { ok: true };
}

module.exports = {
    getContactsByIds,
    create,
    updateContactById,
    deleteContactById,
};


