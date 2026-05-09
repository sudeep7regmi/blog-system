const express = require('express')
const router = express.Router()

const auth = require('../middleware/authMiddleware')
const {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog
} = require('../controllers/blogController')


router.post('/', auth, createBlog)

router.get('/', getBlogs)

router.get('/:id', getBlogById)

router.put('/:id', auth, updateBlog)

router.delete('/:id', auth, deleteBlog)

module.exports = router