const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const StudentModel = require('../model/studentSchema');

// Connecting to database
const query = 'mongodb+srv://admin:admin'
+ '@sandboxapi.1lwolgn.mongodb.net/College?'
+ 'retryWrites=true&w=majority'


mongoose.connect(query).then(() => {
    console.log('Connected to the database');
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });

  router.get('/student', async (req, res)=>{
	try {
		const result = await StudentModel.find()
		return res.status(200).json({
			status: 200,
			ok: true,
			data: result,
		})
	} catch (error) {
		return res.status(500).json({
			status: 500,
			ok: false,
			message: error.message,
		});
	}
  })

  router.get('/student/:id', async (req, res)=>{
	try {
		const StudentId = req.params.id
		const result = await StudentModel.find({StudentId}).exec()
		return res.status(200).json({
			status: 200,
			ok: true,
			data: result,
		})
	} catch (error) {
		return res.status(500).json({
			status: 500,
			ok: false,
			message: error.message,
		});
	}
  })
  router.post('/student', async (req, res)=>{
	try {
		const {StudentId, Name, Roll, Birthday, Address} = req.body;
		const newStudent = await StudentModel.create({
			StudentId:parseInt(StudentId),
			Name:Name,
			Roll:Roll,
			Birthday:Birthday,
			Address:Address
		}) 
		return res.status(201).json({
			status: 201,
			ok: true,
			data: newStudent,
		});
	} catch (error) {
		return res.status(500).json({
			status: 500,
			ok: false,
			message: error.message,
		});
	}
  })

  router.put('/student/:id', async (req, res)=>{
	try {
		const StudentId = req.params.id
		const {Name, Roll, Birthday, Address} = req.body;
		const result = await StudentModel.updateOne(
			{StudentId:parseInt(StudentId)},
			{
				$set:{
					Name:Name,
					Roll:Roll,
					Birthday:Birthday,
					Address:Address
				}		
				
			}
			
		)
		return res.status(200).json({
			status: 200,
			ok: true,
			data: result,
		});
	} catch (error) {
		return res.status(500).json({
			status: 500,
			ok: false,
			message: error.message,
		});
	}
  })

  router.delete('/student/:id', async (req, res)=>{
	try {
		const StudentId = req.params.id
		
		const result = await StudentModel.deleteOne(
			{StudentId:parseInt(StudentId)}
			
		)
		return res.status(200).json({
			status: 200,
			ok: true,
			data: result,
		});
	} catch (error) {
		return res.status(500).json({
			status: 500,
			ok: false,
			message: error.message,
		});
	}
  })







module.exports = router;
