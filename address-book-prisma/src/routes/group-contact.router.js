const express = require('express');

const { GroupContact } = require("../controllers/index")
const { getGroupContact, postGroupContact, updateGroupContact, deleteGroupContactController } = GroupContact;

const groupContact = express.Router();

groupContact.get('/', getGroupContact)
groupContact.post('/', postGroupContact)
groupContact.put('/', updateGroupContact)
groupContact.delete('/:id', deleteGroupContactController)

module.exports = groupContact