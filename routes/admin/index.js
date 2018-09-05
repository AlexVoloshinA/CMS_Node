const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const faker = require('faker');

router.all('/*', (req,res,next) => {
    req.app.locals.layout = 'admin';
    next();
});

router.get('/', (req,res) => {
    res.render('admin/index');
});


router.post('/generate-fake-posts', async (req,res) => {

   
    for(let i = 0; i < req.body.amount; i++){
      let post = new Post();

      post.title = faker.name.title();
      post.status = 'Public';
      post.allowComments = faker.random.boolean();
      post.body = faker.lorem.sentences();

      await post.save();
    };

    res.redirect('/admin/posts');


});


module.exports = router;