const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function get() {
	try {
		const contacts = await prisma.contact.findMany({
			include: {
				GroupContacts: true,
			},
		});

		return contacts;
	} catch (error) {
		throw new error;
	}
}

async function post({ name, phoneNumber, company, email }) {
	try {
		const newContact = await prisma.contact.create({
			data: {
				name,
				phoneNumber,
				company,
				email,
			},
		});

		return newContact;
	} catch (error) {
		throw new error;
	}
}

async function update({ id, name, phoneNumber, company, email }) {
	try {
		const updateContact = await prisma.contact.update({
			where: { id },
			data: {
				name,
				phoneNumber,
				company,
				email,
			},
		});

		return updateContact;
	} catch (error) {
		throw new error;
	}
}

async function deleteContact({ id }) {
	try {
		return await prisma.contact.delete({
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
	deleteContact,
};
