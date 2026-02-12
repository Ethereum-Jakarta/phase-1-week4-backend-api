const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function get() {
	try {
		const groupContacts = await prisma.groupContact.findMany();

		return groupContacts;
	} catch (error) {
		throw new error;
	}
}

async function post({ contactId, groupId }) {
	try {
		const newGroupContact = await prisma.groupContact.create({
			data: {
				contactId,
				groupId,
			},
		});

		return newGroupContact;
	} catch (error) {
		throw new error;
	}
}

async function update({ id, contactId, groupId }) {
	try {
		const updateGroupContact = await prisma.groupContact.update({
			where: { id },
			data: {
				contactId,
				groupId,
			},
		});

		return updateGroupContact;
	} catch (error) {
		throw new error;
	}
}

async function deleteGroupContact({ id }) {
	try {
		return await prisma.groupContact.delete({
			where: { id },
		});
	} catch (error) {
		throw new error;
	}
}

module.exports = {
	get,
	post,
	update,
	deleteGroupContact,
};
