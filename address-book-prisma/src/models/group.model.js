const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function get(){
    try {
        const groups = await prisma.group.findMany({
            include: { GroupContacts: true }
        });

        return groups;
    } catch (error) {
		throw new error;
    }
}

async function post({ groupName }){
    try {
        const newGroup = await prisma.group.create({
            data: {
                groupName
            }
        })

        return newGroup
    } catch (error) {
		throw new error;
    }
}

async function update({ id, groupName }){
    try {
        const updateGroup = await prisma.group.update({
            where: { id },
            data: {
                groupName
            }
        })

        return updateGroup;
    } catch (error) {
		throw new error;
    }
}


async function deleteGroup({ id }){
    try {
        return await prisma.group.delete({
            where: { id }
        })
    } catch (error) {
		throw new error;
    }
}

module.exports = {
    get,
    post,
    update,
    deleteGroup
}