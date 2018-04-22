const jwt = require('jsonwebtoken');
const passport = require('passport');
//
const { auth: { secret } } = require('../../config');
const User = require('./models/User');

function sendToken(ctx) {
    const TWO_HOURS = 2 * 60 * 60;
    const user = ctx.state.user;
    const token = 'Bearer ' + jwt.sign({ id: user.id, email: user.email }, secret, {
        expiresIn: TWO_HOURS
    });
    let nullFilter = {};
    for(let key in user.dataValues){
        if(user.dataValues[key]!==null){
            nullFilter[key] = user.dataValues[key];
        }
    }
    const {password, ...userData} = nullFilter;
    ctx.body = { success: true, token, user: userData };
}
//
//
async function register(ctx) {
    const data = ctx.request.body;
    const user = await User.create(data);
    ctx.state.user = user;
    sendToken(ctx);
}
async function auth(ctx) {
    const { email, password } = ctx.request.body;
    if (!email || !password) {
        ctx.throw(400, 'Please, check your credentials');
    }
    await passport.authenticate('local', { session: false }, (err, user) => {
        if (err) {
            ctx.throw(err);
        }
        if (!user) {
            ctx.throw(400, 'User with such credentials doesn\'t exist');
        }
        ctx.state.user = user;
        sendToken(ctx);
    })(ctx);
}

const CoreController = {
    register,
    auth
};

module.exports = CoreController