const Koa = require('koa');
const Router = require('koa-router');
//

const app = new Koa();
const router = new Router({
    prefix: '/api'
});
app.use(router.routes());


module.exports = app.listen(3000, () => {
    console.log(`Server is listening on port ${3000}`)
});