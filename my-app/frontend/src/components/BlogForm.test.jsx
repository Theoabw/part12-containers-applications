import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { vi } from 'vitest'
import BlogForm from './BlogForm.jsx'

test('BlogForm calls onSubmit with right details when new blog is created', async () => {
    const mockOnSubmit = vi.fn()
    const user = userEvent.setup()

    render(<BlogForm onSubmit={mockOnSubmit} />)

    const titleInput = screen.getByTestId('blog-form-title')
    const authorInput = screen.getByTestId('blog-form-author')
    const urlInput = screen.getByTestId('blog-form-url')
    const submitButton = screen.getByText('Create')

    await user.type(titleInput, 'Test Blog Title')
    await user.type(authorInput, 'Test Author')
    await user.type(urlInput, 'http://testblog.com')

    await user.click(submitButton)

    expect(mockOnSubmit).toHaveBeenCalledTimes(1)
    expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Test Blog Title',
        author: 'Test Author',
        url: 'http://testblog.com'
    })

    expect(titleInput).toHaveValue('')
    expect(authorInput).toHaveValue('')
    expect(urlInput).toHaveValue('')
})