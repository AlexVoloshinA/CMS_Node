const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Comment = require('../../models/Comment');

router.all('/*', (req,res,next) => {
    req.app.locals.layout = 'admin';
    next();
});



router.get('/', async (req,res) => {

    let comments = await Comment.find({}).populate('user');


    res.render('admin/comments', {comments: comments});
});

router.post('/', async (req,res) => {

    let post = await Post.findById(req.body.id);

    const newComment = new Comment({
        user: req.user.id,
        body: req.body.body
    });


    post.comments.push(newComment);

    await post.save();

    await newComment.save();


    res.redirect(`/post/${post.id}`);
});

router.delete('/delete/:id', async (req,res) => {

    await Comment.findByIdAndRemove(req.params.id);

    await Post.findOneAndUpdate({comments: req.params.id}, {$pull: {
        comments: req.params.id
    }});

    res.redirect('/admin/comments');
});

router.post('/approve-comment',async (req, res) => {
    
    let comment = await Comment.findByIdAndUpdate(req.body.id, {$set: {
        approveComment: req.body.approveComment,
    }}, {new: true});
    
    
    res.send(comment);
});



module.exports = router;