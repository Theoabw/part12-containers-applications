const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogsRouter.use(middleware.tokenExtractor)

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response, next) => {
    try {
        const { title, author, url, likes } = request.body

        const user = request.user
        if (!user) {
            return response.status(401).json({ error: 'token missing or invalid' })
        }

        const blog = new Blog({
            title,
            author,
            url,
            likes,
            user: user._id
        })

        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()

        response.status(201).json(savedBlog)
    } catch (error) {
        next(error)
    }
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response, next) => {
    try {
        const blog = await Blog.findById(request.params.id)
        if (!blog) {
            return response.status(404).json({ error: 'blog not found' })
        }

        const user = request.user
        if (!user || blog.user.toString() !== user._id.toString()) {
            return response.status(401).json({ error: 'unauthorized' })
        }

        await Blog.findByIdAndDelete(request.params.id)
        response.status(204).end()
    } catch (error) {
        next(error)
    }
})

blogsRouter.put('/:id', middleware.userExtractor, async (request, response, next) => {
    const id = request.params.id
    const { title, author, url, likes } = request.body

    try {
        const updatedBlog = await Blog.findByIdAndUpdate(id, { title, author, url, likes }, { new: true, runValidators: true, context: 'query' })
        if (updatedBlog) {
            response.json(updatedBlog)
        } else {
            response.status(404).end()
        }
    } catch (error) {
        next(error)
    }
})

module.exports = blogsRouter
