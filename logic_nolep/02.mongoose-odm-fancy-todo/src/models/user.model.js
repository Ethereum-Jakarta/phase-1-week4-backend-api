import mongoose, { mongo } from "mongoose";

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
    },
    email : {
        type: String,
        required: true,
        unique: true,
    },
    phone : {
        type: String,
        required: true,
        unique: true,
    }
}, {timestamps: true})

userSchema.post("findOneAndDelete", async function (doc, next) {
  try {
    if (!doc) return next();
    const Todo = mongoose.model("Todo");
    await Todo.deleteMany({ userId: doc._id });
    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model('User', userSchema);

export default User;