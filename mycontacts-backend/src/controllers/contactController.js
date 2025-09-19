const contactService = require('../services/contactService');
const { apiResponse } = require('../utils/apiResponse');

const createContact = async (req, res, next) => {
  try {
    const contact = await contactService.createContact(req.user.id, req.body);
    return apiResponse(res, 201, 'Contact created successfully', contact);
  } catch (error) {
    next(error);
  }
};

const getContacts = async (req, res, next) => {
  try {
    const contacts = await contactService.getContacts(req.user.id);
    return apiResponse(res, 200, 'List of contacts', contacts);
  } catch (error) {
    next(error);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const contact = await contactService.getContactById(req.user.id, req.params.id);
    return apiResponse(res, 200, 'Contact found', contact);
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const contact = await contactService.updateContact(req.user.id, req.params.id, req.body);
    return apiResponse(res, 200, 'Contact updated', contact);
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    await contactService.deleteContact(req.user.id, req.params.id);
    return apiResponse(res, 204);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
};
