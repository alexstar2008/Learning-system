const Koa = require('koa');
const Router = require('koa-router');
const fs = require('fs');
//

const app = new Koa();
const router = new Router({
    prefix: '/api'
});
app.use(router.routes());

//
const middlewareDir = `${__dirname}/src/middlewares`;
const middlewares = fs.readdirSync(middlewareDir);
middlewares.forEach(middleware => app.use(require(middlewareDir + '/' + middleware)()));

module.exports = app.listen(3000, () => {
    console.log(`Server is listening on port ${3000}`)
});