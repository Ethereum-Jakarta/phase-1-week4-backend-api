const prisma = require('../../prisma/client')

const getAllProducts = async() => {
    const product = await prisma.product.findMany()
    return product
}

const getProduct = async(productId) => {
    const product = await prisma.product.findUnique({where: {id: productId}})
    return product
}

const createProduct = async(productBody) => {
    const newProduct = await prisma.product.create({data: productBody})
    return newProduct
}


const updateProduct = async(productId, productBody) => {
    const updateproduct = await prisma.product.update({
        where: {id: productId}, 
        data: productBody
    })
    return updateproduct
}

const deleteProduct = async(productId) => {
    const deleteProduct = await prisma.product.delete({where: {id: productId}})
    return deleteProduct
}

module.exports = {getAllProducts, getProduct, createProduct, updateProduct, deleteProduct}