import { useState } from "react";

const Blog = ({ blog, addLike, handleRemove, user }) => {
    const [visible, setVisible] = useState(false)

    const blogStyle = {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 10
    }

    const isCreator = user && blog.user && user.username === blog.user.username;

    return (
        <div style={blogStyle} className="blog">
            <div className="blog-title-author">
                {blog.title} {blog.author}
                <button style={{ marginLeft: '5px' }} onClick={() => setVisible(!visible)}>
                    {visible ? 'hide' : 'view'}
                </button>
            </div>
            {visible && (
                <div>
                    <div className="blog-likes">
                        {blog.likes} likes <button onClick={addLike}>like</button>
                    </div>
                    <div className="blog-details">
                        <p className="blog-url">{blog.url}</p>
                        <p className="blog-user">{blog.user && blog.user.username ? blog.user.username : ''}</p>
                        {isCreator && <button onClick={handleRemove}>remove</button>}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Blog