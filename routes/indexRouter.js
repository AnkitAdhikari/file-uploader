const { Router } = require('express');
const { getHomePage } = require('../controller/indexController');
const { getRegister, postRegister, getLogIn, postLogIn, logOutUser } = require('../controller/authController');
const indexRouter = Router();

indexRouter.get('/', getHomePage);
indexRouter.get('/login', getLogIn)
indexRouter.post('/login', postLogIn)
indexRouter.get('/register', getRegister)
indexRouter.post('/register', postRegister)
indexRouter.get('/logout', logOutUser);

module.exports = indexRouter;