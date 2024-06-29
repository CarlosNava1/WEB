const createError = require('http-errors');
const {models} = require('../models');
const { Sequelize } = require('sequelize');

exports.load = async (req,res,next,postId) => {
    try{
        const post = await models.Post.findByPk(postId, {
            include: [
                {model: models.Attachment, as : 'attachment'},
                {model: models.User, as: 'author'}

            ]
        });
        if(post){
            req.load = {...req.load,post};
            next();
            }else{
                throw createError(404, 'There is no post with id=' + postId);
            }
        }catch(error){
            next(error);
        }
}


exports.index = async (req, res, next) => {
    try{
        const posts = await models.Post.findAll({
            include:[{
                model: models.Attachment,
                as: 'attachment' },
                {model: models.User, as: 'author'}

        ]
    });
    res.render('posts/index',{ posts });
    } catch (error){
        next(error);
    }
};

exports.attachment = (req, res, next) => {

    const{post} = req.load;

    const {attachment} = post;

    if(!attachment){
        res.redirect("/images/none.jpg");
    } else if (attachment.image) {
        res.type(attachment.mime);
        res.send(attachment.image);
    } else {
        res.redirect("/images/none.jpg");
    }
};

exports.show = (req, res, next) => {
    const {post} = req.load;

    res.render('posts/show', {post});
};

exports.edit = (req, res, next) => {
    const {post} = req.load;

    res.render('posts/edit',{post});
};

exports.update = async (req, res, next) => {

    const {post} = req.load;

    if (!req.body.title || !req.body.body){
        return res.render('posts/edit', {
            post: {title, body},
            errors: ['Title and body are required.']
        });
    }

    post.title = req.body.title;
    post.body = req.body.body;

    try {
        await post.save({fields: ["title", "body"]});
        console.log('Success: Post edited successfully.');

        try {
            if (!req.file) {
                console.log('Info: Post attachment not changed.');
                return;
            }

            await post.attachment?.destroy();

            const attachment = await models.Attachment.create({
                mime: req.file.mimetype,
                image: req.file.buffer
            });
            await post.setAttachment(attachment);
            console.log('Success: Attachment saved successfully.');
        } catch (error){
            console.log('Error: Failed saving the new attachment: ' + error.message);
        } finally{
            res.redirect('/posts');
        }
    } catch(error){
        if (error instanceof (Sequelize.ValidationError)) {
            console.log('There are errors in the form:');
            error.errors.forEach(({message}) => console.log(message));
            res.render('posts/edit', {post});
        } else {
            next(error);
        }

    }
};

exports.new = (req, res , next) => {
    const post = {
        title: "",
        body: ""
    };

    res.render('posts/new',{ post });
};

exports.adminOrAuthorRequired = (req, res, next) => {
    const isAdmin = !!req.session.loginUser?.isAdmin; 
    const isAuthor = req.load.post.authorId === req.session.loginUser?.id;
    if (isAdmin || isAuthor) {
    next();
    } else {
    console.log('Prohibited operation: The logged in user is not the author of the post, nor an administrator.');
    res.send(403);
    }
};

exports.create = async (req, res, next) => {
    const {title, body} = req.body;
    const authorId = req.session.loginUser?.id;
    let post;
    try {
    post = models.Post.build({
    title,
    body,
    authorId
    });
   
    post = await post.save({fields: ["title", "body", "authorId"]});
   
    try {
    if (!req.file) {
    console.log('Info: Post without attachment.');
    return;
    }
 
    const attachment = await models.Attachment.create({
    
mime: req.file.mimetype,
image: req.file.buffer,
url: null
});
await post.setAttachment(attachment);
console.log('Success: Attachment saved successfully.');
} catch (error) {
console.log('Error: Failed to create attachment: ' + error.message);
} finally {
res.redirect('/posts/' + post.id);
}
} catch (error) {
if (error instanceof (Sequelize.ValidationError)) {
console.log('There are errors in the form:');
error.errors.forEach(({message}) => console.log(message));
res.render('posts/new', {post});
} else {
next(error);
}
}
};

exports.destroy = async (req, res, next) => {
    const attachment = req.load.post.attachment;

    try {
        await req.load.post.destroy();
        await attachment?.destroy();
        console.log('Success: Post deleted successfully.');
        res.redirect('/posts');
    } catch (error) {
        console.log('Error: Error deleting the Post: ' + error.message);
        next(error);
    }
};