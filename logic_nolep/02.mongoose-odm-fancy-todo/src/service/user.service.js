import User from "../models/user.model.js"

class UserService {
    static async create (data) {
        return await User.create(data)
    }

    static async update (id, data) {
        return await User.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
        )
    }

    static async delete (id) {
        return await User.findByIdAndDelete(
            id
        )
    }

    static async show (){
        return await User.find()
    }

    static async find(id){
        return await User.findById(
            id
        )
    }
}

export default UserService;