const jwt = require('jsonwebtoken');
const passport = require('passport');
const _ = require('underscore');
//
const { auth: { secret }, questionAmount } = require('../../config');
const AwsController = require('../libs/aws');
const {
    user: User,
    group: Group,
    question: Question,
    answer: Answer,
    theme: Theme,
    mark: Mark,
    document: Document
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
        await group.addUsers(user);
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
async function addDocToTheme(ctx) {
    const { doc, themeId, name } = ctx.request.body;

    const url = await AwsController.uploadImg(doc, 'ls', themeId + Date.now());
    const document = await Document.create({ name, file: url });
    const theme = await Theme.findOne({ where: { id: themeId } });
    await theme.addDocuments(document);

    ctx.body = {
        success: true,
        message: 'Document was successfully loaded'
    }
}
async function getDocsOfTheme(ctx) {
    const { id } = ctx.params;
    const theme = await Theme.findOne({
        where: { id },
        include: [Document]
    });
    ctx.body = {
        success: true,
        docs: theme.documents
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
    const questionsShuffle = _.shuffle(questions).slice(0, questionAmount);
    
    ctx.body = {
        success: true,
        questions: questionsShuffle
    };
}
async function createQuestionWithAnswers(ctx) {
    const { question: { text, type }, answers: answersRaw, themeId } = ctx.request.body;

    const answersData = answersRaw.map(({ text, correct }) => ({ text, correct }));
    //
    const theme = await Theme.findOne({ where: { id: themeId } });
    const question = await Question.create({ text, type });
    const answers = await Answer.bulkCreate(answersData);
    const res = await question.setAnswers(answers);
    await theme.addQuestions(question);

    ctx.body = {
        success: true,
        message: 'Question was created successfully'
    };
}

// score
async function createMark(ctx) {
    const { score, themeId } = ctx.request.body;
    const { user } = ctx.state;
    const mark = await Mark.create({ score });
    const theme = await Theme.findOne({ id: themeId });
    await user.addMarks(mark);
    await theme.addMarks(mark);

    ctx.body = {
        success: true,
        message: 'Score was successfullly saved'
    };
};

async function getMarksForStudent(ctx) {
    const { user: { id } } = ctx.state;
    const user = await User.findOne(
        {
            where: { id },
            include: [Mark]
        }
    );
    ctx.body = {
        success: true,
        marks: user.marks
    };
};

// group data
async function getStudentsOfGroupWithRating(ctx) {
    const { id } = ctx.params;
    const group = await Group.findOne({
        id,
        include: [{
            model: User,
            include: [{
                model: Mark,
                include: [Theme]
            }],
            attributes: ['name']
        }],
        attributes: ['name', 'course']
    });
    const markByTheme = {};
    const users = group.users.map(user => {
        const marks = user.marks.reduce((prev, next) => {
            prev.push({ score: next.score, theme: next.theme.name });
            const themeName = next.theme.name;
            if (!markByTheme[themeName]) {
                markByTheme[themeName] = [];
                markByTheme[themeName].push(next.score);
            }
            return prev;
        }, []);
        return { student: user.name, marks };
    });
    //
    const avgMarksByTheme = [];
    for (let theme in markByTheme) {
        const len = markByTheme[theme].length;
        const markSum = markByTheme[theme].reduce((prev, next) => prev + next, 0);
        avgMarksByTheme.push({
            theme,
            score: markSum / len
        });
    }

    ctx.body = {
        success: true,
        group: {
            name: group.name,
            course: group.course
        },
        users,
        avgMarks: avgMarksByTheme
    }
}


const CoreController = {
    register,
    auth,
    //
    createGroup,
    getGroupList,
    getStudentsOfGroupWithRating,
    //
    getQuestionsWithAnswers,
    createQuestionWithAnswers,
    //
    createTheme,
    getThemes,
    addDocToTheme,
    getDocsOfTheme,
    //
    createMark,
    getMarksForStudent
};

module.exports = CoreController