const express = require('express')
const router = express.Router()

const auth = require('../middleware/authMiddleware')
const { createBlog, getBlogs } = require('../controllers/blogController')

router.post('/', auth, createBlog)
router.get('/', getBlogs)

module.exports = router
