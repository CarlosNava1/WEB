const Sequelize = require('sequelize');

const url = process.env.DATABASE_URL || "sqlite:blog.sqlite";
const sequelize = new Sequelize (url);
const Post = require('./post') (sequelize)
const Attachment = require('./attachment') (sequelize)
const User = require('./user')(sequelize);
module.exports = {
    User
};
Post.hasOne(Attachment, {as: 'attachment', foreignKey: 'postId'});
Attachment.belongsTo(Post, {as: 'post', foreignKey:'postId'});

User.hasMany(Post, { as: 'posts', foreignKey: 'authorId' });
Post.belongsTo(User, { as: 'author', foreignKey: 'authorId' });

module.exports = sequelize;