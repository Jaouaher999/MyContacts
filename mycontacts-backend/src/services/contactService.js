const Contact = require('../models/contactModel');

const createContact = async (userId, data) => {
  if (!data.phone) {
    throw { status: 400, message: 'Validation error' };
  }
  const contactExist = await Contact.findOne({ phone: data.phone });
  if(contactExist){
    throw {status:409, message: 'Phone number already used'};
  }

  const contact = await Contact.create({
    userId: userId,
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone,
  });

  return {
    _id: contact.id,
    firstName: contact.firstName,
    lastName: contact.lastName,
    phone: contact.phone,
  };
};

const getContacts = async (userId) => {
  return await Contact.find({ userId: userId });
};

const getContactById = async (userId, contactId) => {
  const contact = await Contact.findOne({ _id: contactId, userId: userId });
  if (!contact) {
    throw { status: 404, message: 'Contact not found' };
  }
  return contact;
};

const updateContact = async (userId, contactId, data) => {
  const contact = await Contact.findOneAndUpdate(
    { _id: contactId, userId: userId },
    data,
    { new: true }
  );

  if (!contact) {
    throw { status: 404, message: 'Contact not found' };
  }

  return contact;
};

const deleteContact = async (userId, contactId) => {
  const contact = await Contact.findOneAndDelete({ _id: contactId, userId: userId });

  if (!contact) {
    throw { status: 404, message: 'Contact not found' };
  }
};

module.exports = {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
};
