const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const Post = {
    posts: async () => {
        try {
            const posts = await prisma.post.findMany()
            return posts;
        } catch (error) {
            throw error;
        }
    },
    createPost: async args => {
        try {
            const { title, content, userId } = args.input

            if (!title) throw new Error("title required");
            if (!content) throw new Error("content required");
            if (!userId) throw new Error("userId required");

            const newPost = await prisma.post.create({
                data: {
                    title,
                    content,
                    userId
                }
            })

            return newPost;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Post;