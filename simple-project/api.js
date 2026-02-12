const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const StudentModel = require("./studentschema");
require("dotenv").config();
const dbUri = process.env.MONGODB_URI;
console.log(process.env.MONGODB_URI);
mongoose
  .connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connected to MongoDB.");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// Define your CRUD operation routes here
router.post("/save", async (req, res) => {
  const newStudent = new StudentModel(req.body);

  try {
    const data = await newStudent.save();
    res.send("Data inserted");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error saving the data");
  }
});

router.get("/findall", async (req, res) => {
  try {
    const data = await StudentModel.find();
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching data");
  }
});

router.get("/findfirst", async (req, res) => {  //it will simply return the first document it finds.
  try {
    const data = await StudentModel.findOne(); // Add a condition if necessary
    // console.log("dataaa =>", data);
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching data");
  }
});

router.put("/update", async (req, res) => {
  try {
    const data = await StudentModel.findOneAndUpdate(
      { StudentId: req.body.StudentId },
      req.body,
      {
        new: true,
      }
    );
    if (!data) {
      res.status(404).send("No data found with given StudentId");
    } else {
      res.send("Data updated!");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error updating data");
  }
});

router.delete("/delete", async (req, res) => {
  try {
    const data = await StudentModel.findByIdAndDelete(req.body.id);
    if (data) {
      res.send("Data Deleted!");
    } else {
      res.status(404).send("Data Not Found");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error deleting data");
  }
});

router.get("/latest", async (req, res) => {
  try {
    const data = await StudentModel.find().sort({ _id: -1 }).limit(1);
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching latest data");
  }
});

module.exports = router;
