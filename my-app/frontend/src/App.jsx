import {useState, useEffect, useRef} from 'react'
import Blog from './components/Blog.jsx'
import Notification from './components/Notification.jsx'
import LoginForm from './components/LoginForm.jsx'
import BlogForm from './components/BlogForm.jsx'
import Toggleable from "./components/Togglable.jsx";
import blogService from './services/blogs.js'
import {addBlog} from "./utils/blogHelper.js";

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [user, setUser] = useState(null)
    const [message, setMessage] = useState({message: '', type: ''})
    const blogFormRef = useRef()

    useEffect(() => {
        blogService.getAll().then(blogs => setBlogs(blogs))
    }, [])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            blogService.setToken(user.token)
        }
    }, [])

    const handleBlogSubmit = async (blogData) => {
        try {
            const newBlog = await addBlog({
                ...blogData,
                blogs,
                setBlogs,
                displayMessage,
                toggleVisibility: blogFormRef.current.toggleVisibility,
                user
            })

            console.log('New blog added:', newBlog.title)
        } catch (error) {
            console.error('Error adding blog:', error)
            displayMessage(`Failed to add blog: ${error.message}`, 'error')
        }
    }

    const displayMessage = (message, type) => {
        setMessage({message, type})
        setTimeout(() => {
            setMessage({message: '', type: ''})
        }, 5000)
    }

    const handleLogout = () => {
        window.localStorage.removeItem('loggedBlogAppUser')
        setUser(null)
        displayMessage('Logged out successfully!', 'success')
    }

    const addLike = async (blog) => {
        console.log('like')
        const newBlog = {...blog, likes: blog.likes + 1}
        const updatedBlog = await blogService.update(blog.id, newBlog)
        updatedBlog.user = blog.user
        const blogIndex = blogs.findIndex(b => b.id === blog.id)

        const newBlogs = [...blogs]
        newBlogs[blogIndex] = updatedBlog
        setBlogs(newBlogs)
    }

    const handleRemove = async (blog) => {
        if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
            await blogService.remove(blog.id)
            const newBlogs = blogs.filter(b => b.id !== blog.id)
            setBlogs(newBlogs)
        }
    }

    console.log(blogs)
    return (
        <div>
            <h2>blogs</h2>
            <Notification message={message.message} type={message.type}/>

            {user === null ?
                <LoginForm
                    setUser={setUser}
                    displayMessage={displayMessage}
                />

                :

                <>
                    <p>{user.name} logged-in <button onClick={handleLogout}>logout</button></p>
                    <Toggleable buttonLabel='new blog' ref={blogFormRef}>
                        <BlogForm onSubmit={handleBlogSubmit} />
                    </Toggleable>
                    <div style={{marginTop: '20px'}}>
                        {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
                            <Blog
                                key={blog.id}
                                blog={blog}
                                addLike={() => addLike(blog)}
                                handleRemove={() => handleRemove(blog)}
                                user={user}
                            />
                        )}
                    </div>
                </>}
        </div>
    )
}

export default App