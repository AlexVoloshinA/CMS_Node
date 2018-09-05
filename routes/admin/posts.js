const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');

router.all('/*', (req,res,next) => {
    req.app.locals.layout = 'admin';
    next();
});

router.get('/', async (req,res) => {

    let Posts = await Post.find();


    res.render('admin/posts/index', {posts: Posts});
});

router.get('/create', (req,res) => {
    res.render('admin/posts/create');
});

router.post('/create', async (req,res) => {

    if(req.body.allowComments){
        allowComments = true;
    } else {
        allowComments = false;
    }

    const newPost = new Post({
        title: req.body.title,
        status: req.body.status,
        allowComments: allowComments,
        body: req.body.body
    });

    let savedPost = await newPost.save();
    console.log(savedPost);
    res.redirect('/admin/posts');
});

router.get('/edit/:id',async (req,res) => {

    let findPost = await Post.findById(req.params.id);

    //res.send(req.params.id);
    res.render('admin/posts/edit', {post: findPost});
});

router.put('/edit/:id', async (req,res) => {

    let post = await Post.findById(req.params.id);

    if(req.body.allowComments){
        allowComments = true;
    } else {
        allowComments = false;
    }

    post.title = req.body.title;
    post.status = req.body.status;
    post.allowComments = allowComments;
    post.body = req.body.body;

    await post.save();

    res.redirect('/admin/posts');
});

router.delete('/:id', async (req,res) => {
    let post = await Post.findByIdAndRemove(req.params.id);
    res.redirect('/admin/posts');
});

module.exports = router;