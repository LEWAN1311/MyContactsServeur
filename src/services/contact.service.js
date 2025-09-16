const Contact = require('../models/contact.model');

// Validation: phone must be 10–20 characters and contain only numeric characters
const isValidPhone = (phone) => {
    if (typeof phone !== 'string') return false;
    const trimmedPhone = phone.trim();
    const len = trimmedPhone.length;
    
    // Check length
    if (len < 10 || len > 20) return false;
    
    // Check if all characters are numeric
    const numericRegex = /^\d+$/;
    return numericRegex.test(trimmedPhone);
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

const updateContactById = async (id, dto, userId) => {
    if (!userId) {
        return { ok: false, status: 400, message: "userId is required" };
    }
    
    if (dto.phone !== undefined && !isValidPhone(dto.phone)) {
        return { ok: false, status: 400, message: "phone must be 10-20 characters" };
    }

    const contact = await Contact.findOneAndUpdate(
        { _id: id, userId: userId },
        { $set: dto },
        { new: true }
    );

    if (!contact) {
        return { ok: false, status: 404, message: "Contact not found" };
    }

    return { ok: true, contact };
}

const deleteContactById = async (id, userId) => {
    if (!userId) {
        return { ok: false, status: 400, message: "userId is required" };
    }
    
    const result = await Contact.findOneAndDelete({ _id: id, userId: userId });

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


