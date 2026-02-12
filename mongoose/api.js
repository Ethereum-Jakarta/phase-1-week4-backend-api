const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const StudentModel = require("./studentschema");

const db =
	"mongodb+srv://weiwei2694:TFOK6uVcXM6PKpmv@cluster0.i5qrmcw.mongodb.net/?retryWrites=true&w=majority";
mongoose.Promise = global.Promise;

mongoose.connect(db);

router.get("/students", async (req, res) => {
	try {
		const dataStudent = await StudentModel.find();
		res.status(200).json(dataStudent);
	} catch (error) {
		return res.status(500).json({
			status: 500,
			ok: false,
			message: error.message,
		});
	}
});

router.get("/students/:studentid", async (req, res) => {
	try {
		const StudentId = req.params.studentid;
		if (!StudentId)
			return res.status(400).json({
				status: 400,
				ok: false,
				message: "StudentId required",
			});

		const dataStudent = await StudentModel.find({ StudentId }).exec();
		if (!dataStudent.length)
			return res.status(404).json({
				status: 404,
				ok: true,
				message: "Data not found",
			});

		res.status(200).json({
			status: 200,
			ok: true,
			data: dataStudent,
		});
	} catch (error) {
		return res.status(500).json({
			status: 500,
			ok: false,
			message: error.message,
		});
	}
});

router.post("/students", async (req, res) => {
	try {
		const { StudentId, Name, Roll, Birthday, Address } = req.body;

		if (!StudentId)
			return res.status(400).json({
				status: 400,
				ok: false,
				message: "StudentId required",
			});
		if (!Name)
			return res.status(400).json({
				status: 400,
				ok: false,
				message: "Name required",
			});
		if (!Roll)
			return res.status(400).json({
				status: 400,
				ok: false,
				message: "Roll required",
			});
		if (!Birthday)
			return res.status(400).json({
				status: 400,
				ok: false,
				message: "Birthday required",
			});
		if (!Address)
			return res.status(400).json({
				status: 400,
				ok: false,
				message: "Address required",
			});

		const newStudent = await StudentModel.create({
			StudentId,
			Name,
			Roll,
			Birthday,
			Address,
		});

		return res.status(201).json({
			status: 201,
			ok: true,
			data: newStudent,
		});
	} catch (error) {
		console.error("[ERROR_POST_STUDENT]", error);
		return res.status(500).json({
			status: 500,
			ok: false,
			message: error.message,
		});
	}
});

module.exports = router;
