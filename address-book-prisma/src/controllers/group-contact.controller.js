const { GroupContact } = require("../models/index");
const { get, post, update, deleteGroupContact } = GroupContact;

async function getGroupContact(_, res) {
	try {
		const dataGroupContact = await get();

		return res.status(200).json({
			status: 200,
			ok: true,
			data: dataGroupContact,
		});
	} catch (error) {
		console.log("[ERROR_GET_GROUP_CONTACT]", error.message);

		return res.status(500).json({
			status: 500,
			ok: false,
			message: error.message,
		});
	}
}

async function postGroupContact(req, res) {
	try {
		const { contactId, groupId } = req.body;

		if (!contactId)
			return res.status(400).json({
				status: 400,
				ok: false,
				message: "contactId required",
			});
		if (!groupId)
			return res.status(400).json({
				status: 400,
				ok: false,
				message: "groupId required",
			});

		const dataGroupContact = await post({ contactId, groupId });

		return res.status(201).json({
			status: 201,
			ok: true,
			data: dataGroupContact,
		});
	} catch (error) {
		console.log("[ERROR_POST_GROUP_CONTACT]", error.message);

		return res.status(500).json({
			status: 500,
			ok: false,
			message: error.message,
		});
	}
}

async function updateGroupContact(req, res) {
	try {
		const { id, contactId, groupId } = req.body;

		if (!id)
			return res.status(400).json({
				status: 400,
				ok: false,
				message: "id required",
			});
		if (!contactId)
			return res.status(400).json({
				status: 400,
				ok: false,
				message: "contactId required",
			});
		if (!groupId)
			return res.status(400).json({
				status: 400,
				ok: false,
				message: "groupId required",
			});

		const dataGroupContact = await update({ id, contactId, groupId });

		return res.status(201).json({
			status: 201,
			ok: true,
			data: dataGroupContact,
		});
	} catch (error) {
		console.log("[ERROR_UPDATE_GROUP_CONTACT]", error.message);

		return res.status(500).json({
			status: 500,
			ok: false,
			message: error.message,
		});
	}
}

async function deleteGroupContactController(req, res) {
	try {
		const id = req.params.id;

		if (!id)
			return res.status(400).json({
				status: 400,
				ok: false,
				message: "id required",
			});

		await deleteGroupContact({ id });

		return res.status(204).json(null);
	} catch (error) {
		console.log("[ERROR_DELETE_GROUP_CONTACT]", error.message);

		return res.status(500).json({
			status: 500,
			ok: false,
			message: error.message,
		});
	}
}

module.exports = {
    getGroupContact,
    postGroupContact,
    updateGroupContact,
    deleteGroupContactController
}