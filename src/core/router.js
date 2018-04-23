const Router = require('koa-router');
//
const coreController = require('./controller');

const router = new Router();


router.get('/', (ctx) => {
    ctx.message = 'Hello to API Guide';
});

router.post('/register', coreController.register);
router.post('/auth', coreController.auth);
//
router.post('/groups', coreController.createGroup);
router.get('/groups', coreController.getGroupList);


module.exports = router;