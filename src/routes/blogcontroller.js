const prisma = require('../prisma/client')

const createBlog = async (req, res) => {
  const { title, content } = req.body

  const blog = await prisma.blog.create({
    data: {
      title,
      content,
      userId: req.user.id
    }
  })

  res.json(blog)
}

const getBlogs = async (req, res) => {
  const blogs = await prisma.blog.findMany({
    include: { user: true }
  })

  res.json(blogs)
}

module.exports = { createBlog, getBlogs }
