import blogService from '../services/blogs.js'

export const addBlog = async ({ title, author, url, blogs, setBlogs, displayMessage, toggleVisibility, user }) => {
    try {
        const blogObject = { title, author, url }
        const returnedBlog = await blogService.create(blogObject)
        returnedBlog.user = { id: returnedBlog.user, username: user.username }

        setBlogs(blogs.concat(returnedBlog))
        displayMessage('New blog added successfully!', 'success')
        toggleVisibility()

        return returnedBlog
    } catch (error) {
        throw error
    }
}

