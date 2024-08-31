const _ = require('lodash')

//eslint-disable-next-line no-unused-vars
const dummy = (blogs) => 1

const totalLikes = posts => posts.reduce((sum, post) => sum + post.likes, 0)

const favoriteBlog = blogs => {
    if (blogs.length === 0) {
        return null
    }
    return blogs.reduce((favorite, current) => current.likes > favorite.likes ? current : favorite, blogs[0])
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return null
    }

    const authorCounts = _.countBy(blogs, 'author')
    const topAuthor = _.maxBy(_.keys(authorCounts), author => authorCounts[author])

    return {
        author: topAuthor,
        blogs: authorCounts[topAuthor]
    }
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return null
    }

    const authorLikes = _(blogs)
        .groupBy('author')
        .map((blogs, author) => ({
            author: author,
            likes: _.sumBy(blogs, 'likes')
        }))
        .value()

    const topAuthor = _.maxBy(authorLikes, 'likes')

    return topAuthor
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}
