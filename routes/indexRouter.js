const { Router } = require('express');
const { getHomePage } = require('../controller/indexController');
const { getRegister, postRegister, getLogIn, postLogIn, logOutUser } = require('../controller/authController');
const { getUpload, postUpload, upload } = require('../controller/uploadController');
const indexRouter = Router();

indexRouter.get('/', getHomePage);
indexRouter.get('/login', getLogIn)
indexRouter.post('/login', postLogIn)
indexRouter.get('/register', getRegister)
indexRouter.post('/register', postRegister)
indexRouter.get('/logout', logOutUser);
indexRouter.get('/upload', getUpload);
indexRouter.post('/upload', upload.single('uploaded_file'), postUpload);

module.exports = indexRouter;