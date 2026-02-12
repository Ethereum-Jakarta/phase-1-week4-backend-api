const { Contact } = require("../models/index");
const { get, post, update, deleteContact } = Contact;

async function getContact(_, res) {
	try {
		const dataContact = await get();

		return res.status(200).json({
			status: 200,
			ok: true,
			data: dataContact,
		});
	} catch (error) {
		console.log("[ERROR_GET_CONTACT]", error.message);

		return res.status(500).json({
			status: 500,
			ok: false,
			message: error.message,
		});
	}
}

async function postContact(req, res) {
	try {
		const { name, phoneNumber, company, email } = req.body;

		if (!name)
			return res
				.status(400)
				.json({ status: 400, ok: false, message: "name required" });
		if (!phoneNumber)
			return res.status(400).json({
				status: 400,
				ok: false,
				message: "phoneNumber required",
			});
		if (!company)
			return res
				.status(400)
				.json({ status: 400, ok: false, message: "company required" });
		if (!email)
			return res
				.status(400)
				.json({ status: 400, ok: false, message: "email required" });

		const dataContact = await post({ name, phoneNumber, company, email });

		return res.status(201).json({
			status: 201,
			ok: true,
			data: dataContact,
		});
	} catch (error) {
		console.log("[ERROR_POST_CONTACT]", error.message);

		return res.status(500).json({
			status: 500,
			ok: false,
			message: error.message,
		});
	}
}

async function updateContact(req, res) {
	try {
		const { id, name, phoneNumber, company, email } = req.body;

		if (!id)
			return res
				.status(400)
				.json({ status: 400, ok: false, message: "id required" });
		if (!name)
			return res
				.status(400)
				.json({ status: 400, ok: false, message: "name required" });
		if (!phoneNumber)
			return res.status(400).json({
				status: 400,
				ok: false,
				message: "phoneNumber required",
			});
		if (!company)
			return res
				.status(400)
				.json({ status: 400, ok: false, message: "company required" });
		if (!email)
			return res
				.status(400)
				.json({ status: 400, ok: false, message: "email required" });

		const dataContact = await update({
			id,
			name,
			phoneNumber,
			company,
			email,
		});

		return res.status(201).json({
			status: 201,
			ok: true,
			data: dataContact,
		});
	} catch (error) {
		console.log("[ERROR_UPDATE_CONTACT]", error.message);

		return res.status(500).json({
			status: 500,
			ok: false,
			message: error.message,
		});
	}
}

async function deleteContactController(req, res) {
	try {
		const id = req.params.id;
		if (!id)
			return res
				.status(400)
				.json({ status: 400, ok: false, message: "id required" });

		await deleteContact({ id });

		return res.status(204).json(null);
	} catch (error) {
		console.log("[ERROR_DELETE_CONTACT]", error.message);

		return res.status(500).json({
			status: 500,
			ok: false,
			message: error.message,
		});
	}
}

module.exports = {
	getContact,
	postContact,
	updateContact,
	deleteContactController,
};
