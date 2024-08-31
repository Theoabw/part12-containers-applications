import React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from "@testing-library/user-event";
import { vi } from 'vitest'
import Blog from './Blog.jsx'


test('renders blog title and author, but not URL or likes by default', () => {
    const blog = {
        title: 'Test Blog',
        author: 'Test Author',
        url: 'https://testblog.com',
        likes: 5
    }

    render(<Blog blog={blog} />)

    const titleAuthorElement = screen.getByText('Test Blog Test Author')
    expect(titleAuthorElement).toBeInTheDocument()

    const urlElement = screen.queryByText('https://testblog.com')
    expect(urlElement).not.toBeInTheDocument()

    const likesElement = screen.queryByText('5 likes')
    expect(likesElement).not.toBeInTheDocument()
})

test('blog URL and number of likes are shown when the view button is clicked', async () => {
    const blog = {
        title: 'Test Blog',
        author: 'Test Author',
        url: 'https://testblog.com',
        likes: 5,
        user: { username: 'testuser' }
    }

    render(<Blog blog={blog} />)

    expect(screen.queryByText('https://testblog.com')).not.toBeInTheDocument()
    expect(screen.queryByText('5 likes')).not.toBeInTheDocument()

    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    expect(screen.getByText('https://testblog.com')).toBeInTheDocument()
    expect(screen.getByText('5 likes')).toBeInTheDocument()
})

test('like button event handler is called twice when clicked twice', async () => {
    const blog = {
        title: 'Test Blog',
        author: 'Test Author',
        url: 'https://testblog.com',
        likes: 5,
        user: { username: 'testuser' }
    }

    const mockHandler = vi.fn()

    render(<Blog blog={blog} addLike={mockHandler} />)

    const user = userEvent.setup()

    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler).toHaveBeenCalledTimes(2)
})