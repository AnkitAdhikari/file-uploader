const { Router } = require('express');
const { getHomePage } = require('../controller/indexController');
const { getRegister, postRegister, getLogIn, postLogIn, logOutUser } = require('../controller/authController');
const { getUpload, postUpload, upload } = require('../controller/uploadController');
const { getNewFolder, postNewFolder, getFolder } = require('../controller/folderController');
const { getFileById, deleteFileById, downloadFile, updateFile } = require('../controller/fileController');
const indexRouter = Router();

indexRouter.get('/', getHomePage);
indexRouter.get('/login', getLogIn)
indexRouter.post('/login', postLogIn)
indexRouter.get('/register', getRegister)
indexRouter.post('/register', postRegister)
indexRouter.get('/logout', logOutUser);
indexRouter.get('/upload', getUpload);
indexRouter.post('/upload', upload.single('uploaded_file'), postUpload);
indexRouter.get('/folder', getNewFolder)
indexRouter.post('/folder', postNewFolder);
indexRouter.get('/folder/:id', getFolder);
indexRouter.get('/file/:id', getFileById);
indexRouter.delete('/file/:id', deleteFileById);
indexRouter.get('/download/:id', downloadFile);
indexRouter.put('/file/:id', updateFile);

module.exports = indexRouter;