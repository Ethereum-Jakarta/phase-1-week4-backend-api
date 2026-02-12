const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { productService, userService, orderService } = require('../services');
const ApiError = require('../utils/ApiError');


const getUsers = async (req, res) => {
    try {
        var page = 1;
        var take = 5;
        var skip = (page-1)*take;
        // console.log("coba")
        const result = await userService.queryUsers(skip,take);
        res.status(200).send({
            status: 200,
            message: "Get Users Success",
            data: result
        })
    }catch (err){
        console.log(err)
        res.status(500).send({
            status: 500,
            message: "Get Users Error",
            data: null
        })

    }
}

const findUser = async (req, res) => {
    try {
        // console.log("coba")
        const result = await userService.getUserById(req.params.userId)
        res.status(200).send({
            status: 200,
            message: "Get User Success",
            data: result
        })
    }catch (err){
        console.log(err)
        res.status(500).send({
            status: 500,
            message: "Get User Error",
            data: null
        })

    }
}

const createUser = catchAsync(async (req, res) => {
    const existingUser = await userService.getUserByEmail(req.body.email);
  
    if (existingUser) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
  
    const userCreated = await userService.createUser(req.body);
    res.status(httpStatus.CREATED).send({ userCreated });
  });


const updateUser = async (req, res) => {
    try {
        // console.log("coba")
        const result = await userService.updateUserById(req.params.userId,req.body)
        res.status(200).send({
            status: 200,
            message: "update User Success",
            data: result
        })
    }catch (err){
        console.log(err)
        res.status(500).send({
            status: 500,
            message: "update User Error",
            data: null
        })

    }
}
const deleteUser = async (req, res) => {
    try {
        // console.log("coba")
        const result = await userService.deleteUserById(req.params.userId)
        res.status(200).send({
            status: 200,
            message: "delete User Success",
            data: result
        })
    }catch (err){
        console.log(err)
        res.status(500).send({
            status: 500,
            message: "delete User Error",
            data: null
        })

    }
}
const getProductsByUser = catchAsync(async (req, res) => {
    const result = await productService.queryProductsByUserId(req.body.userId);
    
    res.status(httpStatus.OK).send({
      status: httpStatus.OK,
      message: "Get Products Success",
      data: result
    });
  });

const getOrdersByUser = catchAsync(async (req, res) => {
const result = await orderService.queryOrdersByUserId(req.body.userId);

res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: "Get Orders Success",
    data: result
});
});


module.exports = {
    getUsers,
    findUser,
    createUser,
    updateUser,
    deleteUser,
    getProductsByUser,
    getOrdersByUser
}