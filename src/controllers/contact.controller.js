const { getContactsByIds, create, updateContactById, deleteContactById } = require('../services/contact.service');
const ApiError = require('../utils/apiReponse');

const getContacts = async (req, res, next) => {
    try {
        if (!req.user || !req.user.user || !req.user.user._id) {
            return next(new ApiError(401, "Unauthorized: User information is missing"));
        }
        const userId = req.user.user._id;
        const items = await getContactsByIds(userId);
        return res.json(items);
    }
    catch (error) { return next(error); }
};

const createContact = async (req, res, next) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return next(new ApiError(400, "Request body is required"));
        }
        const result = await create(req.user.user._id, req.body);
        if (!result.ok) return res.status(result.status).json({ message: result.message });
        return res.status(201).json(result.contact);
    }
    catch (error) { return next(error) };
};

const updateContact = async (req, res, next) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return next(new ApiError(400, "Request body is required"));
        }
        const { id } = req.params;
        const result = await updateContactById(id, req.body);
        if (!result.ok) return next(new ApiError(result.status || 400, result.message));
        return res.json(result.contact);
    }
    catch (error) { return next(error) };
};

const deleteContact = async (req, res, next) => {
    try {
        if (!req.params || Object.keys(req.params).length === 0) {
            return next(new ApiError(400, "Parameters are required"));
        }
        const { id } = req.params;
        const result = await deleteContactById(id);
        if (!result.ok) return next(new ApiError(result.status || 400, result.message));
        return res.status(204).send();
    }
    catch (error) { return next(error) };
};

module.exports = {
    getContacts,
    createContact,
    updateContact,
    deleteContact,
};


