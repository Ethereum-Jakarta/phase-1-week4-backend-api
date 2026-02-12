const { Group } = require("../models/index");
const { get, post, update, deleteGroup } = Group;

async function getGroup(_, res) {
	try {
		const dataGroup = await get();

		return res.status(200).json({
			status: 200,
			ok: true,
			data: dataGroup,
		});
	} catch (error) {
		console.log("[ERROR_GET_GROUP]", error.message);

		return res.status(500).json({
			status: 500,
			ok: false,
			message: error.message,
		});
	}
}

async function postGroup(req, res) {
	try {
		const { groupName } = req.body;

		if (!groupName)
			return res.status(400).json({
				status: 400,
				ok: false,
				message: "groupName required",
			});

		const dataGroup = await post({ groupName });
		return res.status(201).json({
			status: 201,
			oke: true,
			data: dataGroup,
		});
	} catch (error) {
		console.log("[ERROR_POST_GROUP]", error.message);

		return res.status(500).json({
			status: 500,
			ok: false,
			message: error.message,
		});
	}
}

async function updateGroup(req, res) {
	try {
		const { id, groupName } = req.body;

		if (!id)
			return res.status(400).json({
				status: 400,
				ok: false,
				message: "id required",
			});
		if (!groupName)
			return res.status(400).json({
				status: 400,
				ok: false,
				message: "groupName required",
			});

		const dataGroup = await update({ id, groupName });
		return res.status(201).json({
			status: 201,
			oke: true,
			data: dataGroup,
		});
	} catch (error) {
		console.log("[ERROR_UPDATE_GROUP]", error.message);

		return res.status(500).json({
			status: 500,
			ok: false,
			message: error.message,
		});
	}
}

async function deleteGroupController(req, res) {
	try {
		const id = req.params.id;

		if (!id)
			return res.status(400).json({
				status: 400,
				ok: false,
				message: "id required",
			});

		await deleteGroup({ id });

		return res.status(204).json(null);
	} catch (error) {
		console.log("[ERROR_DELETE_GROUP]", error.message);

		return res.status(500).json({
			status: 500,
			ok: false,
			message: error.message,
		});
	}
}

module.exports = {
	getGroup,
	postGroup,
	updateGroup,
	deleteGroupController,
};
