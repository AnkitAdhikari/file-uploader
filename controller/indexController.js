const appRoot = require('app-root-path');
const fs = require('node:fs');
const { getAllResources } = require('./fileController');
const getHomePage = async (req, res) => {
    if (req.user) {
        req.user.resources = await getAllResources(req, res);
        console.log(req.user.resources)
    }
    res.render('home', { pageTitle: 'File Uploader', user: req.user });
}

module.exports = {
    getHomePage,
}