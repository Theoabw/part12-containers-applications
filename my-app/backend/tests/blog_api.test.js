const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const api = supertest(app)

const getToken = async () => {
    const user = await User.findOne({ username: 'testuser' })
    if (!user) {
        throw new Error('Test user not found')
    }
    const userForToken = {
        username: user.username,
        id: user._id,
    }
    return jwt.sign(userForToken, process.env.SECRET)
}


const initialBlogs = [
    {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
    },
    {
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
    }
]

describe('Blog API', () => {
    let user

    beforeEach(async () => {
        await Blog.deleteMany({})
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('password', 10)
        user = new User({ username: 'testuser', passwordHash })
        await user.save()

        const blog1 = new Blog({ ...initialBlogs[0], user: user._id })
        const blog2 = new Blog({ ...initialBlogs[1], user: user._id })

        await blog1.save()
        await blog2.save()

        user.blogs = [blog1._id, blog2._id]
        await user.save()
    })

    after(async () => {
        await mongoose.connection.close()
    })

    describe('GET /api/blogs', () => {
        test('blogs are returned as json', async () => {
            await api
                .get('/api/blogs')
                .expect(200)
                .expect('Content-Type', /application\/json/)
        })

        test('return correct amount of blogs', async () => {
            const response = await api.get('/api/blogs')
            assert.strictEqual(response.body.length, initialBlogs.length)
        })

        test('unique identifier property is named id', async () => {
            const response = await api.get('/api/blogs')
            response.body.forEach(blog => {
                assert(blog.id !== undefined)
                assert(blog._id === undefined)
            })
        })
    })

    describe('POST /api/blogs', () => {
        test('creates a new blog post', async () => {
            const newBlog = {
                title: "Test Blog",
                author: "Test Author",
                url: "https://example.com",
                likes: 7,
            }

            const token = await getToken()

            const initialResponse = await api.get('/api/blogs')
            const initialLength = initialResponse.body.length

            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const response = await api.get('/api/blogs')
            const blogs = response.body

            assert.strictEqual(blogs.length, initialLength + 1)

            const titles = blogs.map(b => b.title)
            assert(titles.includes(newBlog.title))
        })

        test('defaults likes property to 0 if missing', async () => {
            const newBlog = {
                title: "Test Blog",
                author: "Test Author",
                url: "https://example.com",
            }

            const token = await getToken()

            const response = await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const savedBlog = response.body
            assert.strictEqual(savedBlog.likes, 0)
        })

        test('fails with status code 400 if title is missing', async () => {
            const newBlog = {
                author: "Test Author",
                url: "https://example.com",
            }

            const token = await getToken()

            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(newBlog)
                .expect(400)
        })

        test('fails with status code 400 if url is missing', async () => {
            const newBlog = {
                title: "Test Blog",
                author: "Test Author",
            }

            const token = await getToken()

            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(newBlog)
                .expect(400)
        })

        test('fails with status code 401 if token is not provided', async () => {
            const newBlog = {
                title: "Test Blog",
                author: "Test Author",
                url: "https://example.com",
                likes: 7,
            }

            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(401)
        })
    })

    describe('DELETE /api/blogs/:id', () => {
        test('deletes a single blog post', async () => {
            const newBlog = {
                title: "To be deleted",
                author: "Test Author",
                url: "https://example.com",
                likes: 5,
            }

            const token = await getToken()

            const response = await api.post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(newBlog)
            const blogToDelete = response.body

            const initialResponse = await api.get('/api/blogs')
            const initialLength = initialResponse.body.length

            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(204)

            const responseAfterDeletion = await api.get('/api/blogs')
            const blogsAfterDeletion = responseAfterDeletion.body

            assert.strictEqual(blogsAfterDeletion.length, initialLength - 1)
        })

        test('fails with status code 401 if token is not provided', async () => {
            const newBlog = {
                title: "To be deleted",
                author: "Test Author",
                url: "https://example.com",
                likes: 5,
            }

            const response = await api.post('/api/blogs').send(newBlog)
            const blogToDelete = response.body

            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .expect(401)
        })
    })

    describe('PUT /api/blogs/:id', () => {
        test('updates a blog post', async () => {
            const newBlog = {
                title: "To be updated",
                author: "Test Author",
                url: "https://example.com",
                likes: 5,
            }

            const token = await getToken()

            const response = await api.post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(newBlog)
            const blogToUpdate = response.body

            const updatedBlogData = {
                title: "Updated Title",
                author: "Updated Author",
                url: "https://updatedurl.com",
                likes: 10,
            }

            const updatedResponse = await api
                .put(`/api/blogs/${blogToUpdate.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send(updatedBlogData)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            const updatedBlog = updatedResponse.body

            assert.strictEqual(updatedBlog.title, updatedBlogData.title)
            assert.strictEqual(updatedBlog.author, updatedBlogData.author)
            assert.strictEqual(updatedBlog.url, updatedBlogData.url)
            assert.strictEqual(updatedBlog.likes, updatedBlogData.likes)
        })

        test('fails with status code 401 if token is not provided', async () => {
            const newBlog = {
                title: "To be updated",
                author: "Test Author",
                url: "https://example.com",
                likes: 5,
            }

            const response = await api.post('/api/blogs').send(newBlog)
            const blogToUpdate = response.body

            const updatedBlogData = {
                title: "Updated Title",
                author: "Updated Author",
                url: "https://updatedurl.com",
                likes: 10,
            }

            await api
                .put(`/api/blogs/${blogToUpdate.id}`)
                .send(updatedBlogData)
                .expect(401)
        })
    })

})
