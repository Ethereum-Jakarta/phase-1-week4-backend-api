import express from "express";
import mongoose from "mongoose";
import User from "./model/user.js";

const app = express();
const port = process.env.PORT ||3000;

app.use(express.json());

//koneksi ke mongodb
mongoose.connect("mongodb://localhost:27017/test-mongoose")
.then(() => {
    console.log("Connected to MongoDB")
})
.catch((err) => {
    console.error("Connection error:", err)
})


//endpoint untuk menambahkan pengguna baru
app.post('/users', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})

app.get('/users', async (req, res) => {
    try {
        const user = await User.find();
        res.send(user)
    } catch (error) {
        res.status(500).send(error)
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})