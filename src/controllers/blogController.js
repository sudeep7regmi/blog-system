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
    select: {
      id: true,
      title: true,
      content: true,
      userId: true
    }
  })

  res.json(blogs)
}

const getBlogById = async (req, res) => {
  const id = parseInt(req.params.id)

  const blog = await prisma.blog.findUnique({
    where: { id },
    include: { user: true }
  })

  if (!blog) {
    return res.status(404).json({ message: "Blog not found" })
  }

  res.json(blog)
}


const updateBlog = async (req, res) => {
  const id = parseInt(req.params.id)
  const { title, content } = req.body

  const blog = await prisma.blog.findUnique({
    where: { id }
  })

  if (!blog) {
    return res.status(404).json({ message: "Blog not found" })
  }

  
  if (blog.userId !== req.user.id) {
    return res.status(403).json({ message: "Not allowed" })
  }

  const updatedBlog = await prisma.blog.update({
    where: { id },
    data: { title, content }
  })

  res.json(updatedBlog)
}


const deleteBlog = async (req, res) => {
  const id = parseInt(req.params.id)

  const blog = await prisma.blog.findUnique({
    where: { id }
  })

  if (!blog) {
    return res.status(404).json({ message: "Blog not found" })
  }

  
  if (blog.userId !== req.user.id) {
    return res.status(403).json({ message: "Not allowed" })
  }

  await prisma.blog.delete({
    where: { id }
  })

  res.json({ message: "Blog deleted successfully" })
}

module.exports = {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog
}