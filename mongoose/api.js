const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const studentModel = require("./studentSchema");

const db =
  "mongodb+srv://Fin:D8LCWxQgn8pTzKNo@cluster0.ce6tidp.mongodb.net/?retryWrites=true&w=majority";
mongoose.Promise = global.Promise;
mongoose.connect(db);

router.get("/students", async (req, res) => {
  try {
    const dataStudent = await studentModel.find();
    res.status(200).json(dataStudent);
  } catch (error) {
    return res.res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
});

router.get("/students/:studentid", async (req, res) => {
  try {
    const StudentId = req.params.studentid;
    if (!StudentId) {
      return res.status(500).json({
        status: 500,
        message: `Id required`,
      });
    }
    const dataStudent = await studentModel.find({ StudentId }).exec();
    return res.status(200).json({
      status: 200,
      message: `Get date succsessfully!`,
      data: dataStudent,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
});

router.post("/students", async (req, res) => {
  try {
    const { StudentId, Name, Roll, Birthday, Address } = req.body;

    if (!StudentId) {
      return res.status(400).json({
        status: 400,
        message: "Id Required",
      });
    }
    if (!Name) {
      return res.status(400).json({
        status: 400,
        message: "Name Required",
      });
    }
    if (!Roll) {
      return res.status(400).json({
        status: 400,
        message: "Roll Required",
      });
    }
    if (!Birthday) {
      return res.status(400).json({
        status: 400,
        message: "Birthday Required",
      });
    }
    if (!Address) {
      return res.status(400).json({
        status: 400,
        message: "Address Required",
      });
    }

    const newStudent = await studentModel.create({
      StudentId, 
      Name, 
      Roll, 
      Birthday, 
      Address
    })

    return res.status(200).json({
      status: 200,
      message: "Post Date Succsess!"
    })
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
});

module.exports = router
