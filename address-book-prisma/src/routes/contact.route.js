const express = require('express');

const { Contact } = require("../controllers/index")
const { getContact, postContact, updateContact, deleteContactController } = Contact;

const contactRouter = express.Router();

contactRouter.get('/', getContact)
contactRouter.post('/', postContact)
contactRouter.put('/', updateContact)
contactRouter.delete('/:id', deleteContactController)

module.exports = contactRouter