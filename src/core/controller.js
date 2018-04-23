const jwt = require('jsonwebtoken');
const passport = require('passport');
//
const { auth: { secret } } = require('../../config');
const {
    user: User,
    group: Group,
    question: Question,
    answer: Answer,
    theme: Theme,
    mark: Mark
} = require('../libs/sequelize');

function sendToken(ctx) {
    const TWO_HOURS = 2 * 60 * 60;
    const user = ctx.state.user;
    const token = 'Bearer ' + jwt.sign({ id: user.id, email: user.email }, secret, {
        expiresIn: TWO_HOURS
    });
    let nullFilter = {};
    for (let key in user.dataValues) {
        if (user.dataValues[key] !== null) {
            nullFilter[key] = user.dataValues[key];
        }
    }
    const { password, ...userData } = nullFilter;
    ctx.body = { success: true, token, user: userData };
}
//
//
async function register(ctx) {
    const { groupId, ...data } = ctx.request.body;
    const user = await User.create(data);
    if (groupId) {
        const group = await Group.findOne({ id: groupId });
        await group.setUsers(user);
    }
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

// groups
async function createGroup(ctx) {
    const data = ctx.request.body;
    const group = await Group.create(data);
    ctx.body = {
        success: true,
        groupId: group.get('id'),
        message: 'Group was successfully created'
    };
}
async function getGroupList(ctx) {
    const groups = await Group.findAll({
        attributes: ['id', 'name', 'course']
    });
    ctx.body = {
        success: true,
        groups
    };
}

// themes
async function createTheme(ctx) {
    const data = ctx.request.body;
    const theme = await Theme.create(data);

    ctx.body = {
        success: true,
        themeId: theme.id,
        message: 'Successfully created'
    };
}
async function getThemes(ctx) {
    const themes = await Theme.findAll();
    ctx.body = {
        success: true,
        themes
    };
}

// questions
async function getQuestionsWithAnswers(ctx) {
    const { themeId } = ctx.params;
    const questions = await Question.findAll({
        where: {
            themeId
        },
        include: [Answer]
    });
    ctx.body = {
        success: true,
        questions
    };
}
async function createQuestionWithAnswers(ctx) {
    const { question: { text, isMulty }, answers: answersRaw, themeId } = ctx.request.body;

    const answersData = answersRaw.map(({ text, create }) => ({ text, create }));
    //
    const theme = await Theme.findOne({ where: { id: themeId } });
    const question = await Question.create({ text, isMulty });
    const answers = await Answer.bulkCreate(answersData);
    const res = await question.setAnswers(answers);
    await theme.setQuestion(question);

    ctx.body = {
        success: true,
        message: 'Question was created successfully'
    };
}

// score
async function createMark(ctx) {
    const { score, themeId } = ctx.request.body;
    const { id: userId } = ctx.state.user;
    const mark = await Mark.create({ score });
    const user = await User.findOne({ id });
    const theme = await Them.findOne({ id: themeId });
    await user.setMark(mark);
    await theme.setMark(mark);

    ctx.body = {
        success: true,
        message: 'Score was successfullly saved'
    };
};

async function getMarksForStudent(ctx) {
    const { id: userId } = ctx.state.user;
    const user = await User.findOne({ id }, { include: [Mark] });

    const marks =
        ctx.body = {
            success: true,
            marks: user.marks
        };
};


const CoreController = {
    register,
    auth,
    //
    createGroup,
    getGroupList,
    //
    getQuestionsWithAnswers,
    createQuestionWithAnswers,
    //
    createTheme,
    getThemes,
    //
    createMark,
    getMarksForStudent
};

module.exports = CoreController