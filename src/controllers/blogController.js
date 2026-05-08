const prisma = require('../prisma/client')

/* ---------------- CREATE BLOG ---------------- */
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

/* ---------------- GET ALL BLOGS ---------------- */
const getBlogs = async (req, res) => {
  const blogs = await prisma.blog.findMany({
    include: { user: true }
  })

  res.json(blogs)
}

/* ---------------- GET SINGLE BLOG ---------------- */
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

/* ---------------- UPDATE BLOG ---------------- */
const updateBlog = async (req, res) => {
  const id = parseInt(req.params.id)
  const { title, content } = req.body

  const blog = await prisma.blog.findUnique({
    where: { id }
  })

  if (!blog) {
    return res.status(404).json({ message: "Blog not found" })
  }

  // ownership check (IMPORTANT)
  if (blog.userId !== req.user.id) {
    return res.status(403).json({ message: "Not allowed" })
  }

  const updatedBlog = await prisma.blog.update({
    where: { id },
    data: { title, content }
  })

  res.json(updatedBlog)
}

/* ---------------- DELETE BLOG ---------------- */
const deleteBlog = async (req, res) => {
  const id = parseInt(req.params.id)

  const blog = await prisma.blog.findUnique({
    where: { id }
  })

  if (!blog) {
    return res.status(404).json({ message: "Blog not found" })
  }

  // ownership check
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