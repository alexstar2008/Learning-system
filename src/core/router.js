const Router = require('koa-router');
//
const coreController = require('./controller');

const router = new Router();


router.get('/', (ctx) => {
    ctx.message = 'Hello to API Guide';
});

router.post('/register', coreController.register);
router.post('/auth', coreController.auth);



module.exports = router;