const Router = require('koa-router');
//
const router = new Router();


router.get('/', (ctx) => {
    ctx.message = 'Hello to API Guide';
});


module.exports = router;