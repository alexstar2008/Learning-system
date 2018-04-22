const Koa = require('koa');
const Router = require('koa-router');
const fs = require('fs');
//
const coreRouter = require('./src/core/router');

const app = new Koa();
//
const middlewareDir = `${__dirname}/src/middlewares`;
const middlewares = fs.readdirSync(middlewareDir);
middlewares.forEach(middleware => app.use(require(middlewareDir + '/' + middleware)()));
//
const router = new Router({
    prefix: '/api'
});
router.use(coreRouter.routes());
app.use(router.routes());


module.exports = app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is listening on port ${process.env.PORT || 3000}`)
});