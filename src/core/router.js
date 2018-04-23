const Router = require('koa-router');
//
const coreController = require('./controller');
const passport = require('passport');
const router = new Router();


router.get('/', (ctx) => {
    ctx.message = 'Hello to API Guide';
});

router.post('/register', coreController.register);
router.post('/auth', coreController.auth);
//
router.post('/groups', coreController.createGroup);
router.get('/groups', coreController.getGroupList);
router.get('/groups/:id', coreController.getStudentsOfGroupWithRating);
//
router.get('/themes', coreController.getThemes);
router.post('/themes', coreController.createTheme);
//
router.get('/questions/:themeId', coreController.getQuestionsWithAnswers);
router.post('/questions', coreController.createQuestionWithAnswers);
//
//
router.use(async function jwt(ctx, next) {
    await passport.authenticate('jwt', { session: false })(ctx, next);
});
router.post('/mark', coreController.createMark);
router.get('/mark', coreController.getMarksForStudent);

module.exports = router;