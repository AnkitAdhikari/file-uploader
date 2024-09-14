const appRoot = require('app-root-path');
const fs = require('node:fs');
const { getAllFiles } = require('./fileController');
const getHomePage = async (req, res) => {
    if (req.user) {
        req.user.files = await getAllFiles(req, res);
    }
    res.render('home', { pageTitle: 'File Uploader', user: req.user });
}

module.exports = {
    getHomePage,
}