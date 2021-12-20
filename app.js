const express = require('express')
const app = express()
const port = 3000
const { Post } = require('./models')

function postParams(req) {
    const { body } = req
    const { content } = body
    return { content }
}

function handleError(err, res, req) {
    let status = 500;
    if (err.name == "SequelizeValidationError") {
        status = 422
    }
    if (err.name == "notEmpty") {
        status = 422
    }
    console.error(err)
    res.status(status).send(err)
}

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/posts', async(req, res) => {
    try {
        res.send(await Post.findAll())
    } catch (error) {
        handleError(error, res, req)
    }
})

app.post('/posts', async(req, res) => {
    try {
        const post = await Post.create(postParams(req))
        res.send(post)
    } catch (error) {
        handleError(error, res, req)
    }
})

app.get('/posts/:id', async(req, res) => {
    try {
        const post = await Post.findByPk(req.params.id)
        if (!post) return res.status(404).send('Not found')
        res.send(post)
    } catch (error) {
        handleError(error, res, req)
    }
})

app.patch('/posts/:id', async(req, res) => {
    try {
        const post = await Post.findByPk(req.params.id)
        if (!post) return res.status(404).send('Not found')
        await post.update(postParams(req))
        res.send(post)
    } catch (error) {
        handleError(error, res, req)
    }
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})