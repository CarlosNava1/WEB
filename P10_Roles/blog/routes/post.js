var express = require('express');
var router = express.Router();

const postController = require('../controllers/post');
const sessionController = require('../controllers/session');
const multer = require('multer');
const storage = multer.memoryStorage()
const upload = multer({
    storage: storage,
    limits: {fileSize: 20 * 1024 * 1024}
});


router.param('postId', postController.load);
router.get('/',postController.index);
router.get('/:postId/attachment', postController.attachment);
router.get('/:postId(\\d+)', postController.show);
router.get('/:postId(\\d+)/edit', postController.adminOrAuthorRequired,postController.edit);
router.put('/:postId(\\d+)', upload.single('image'), postController.update);
router.get ('/new',sessionController.loginRequired, postController.new);
router.post ('/', upload.single('image'),sessionController.loginRequired, postController.create);
router.delete('/:postId(\\d+)', postController.adminOrAuthorRequired, postController.destroy);



module.exports = router;