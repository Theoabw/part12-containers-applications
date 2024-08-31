import { useState } from "react";
import PropTypes from "prop-types";
import { addBlog } from "../utils/blogHelper.js";

const BlogForm = ({ onSubmit }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const handleSubmit = (event) => {
        event.preventDefault()
        onSubmit({ title, author, url })
        setTitle('')
        setAuthor('')
        setUrl('')
    }

    return (
        <form onSubmit={handleSubmit} className="blog-form">
            <div>
                <label htmlFor="title">Title:</label>
                <input
                    id="title"
                    data-testid="blog-form-title"
                    value={title}
                    onChange={({target}) => setTitle(target.value)}
                />
            </div>
            <div>
                <label htmlFor="author">Author:</label>
                <input
                    id="author"
                    data-testid="blog-form-author"
                    value={author}
                    onChange={({target}) => setAuthor(target.value)}
                />
            </div>
            <div>
                <label htmlFor="url">URL:</label>
                <input
                    id="url"
                    data-testid="blog-form-url"
                    value={url}
                    onChange={({target}) => setUrl(target.value)}
                />
            </div>
            <button type="submit" data-testid="blog-form-submit">Create</button>
        </form>
    )
}

BlogForm.propTypes = {
    onSubmit: PropTypes.func.isRequired
}

export default BlogForm