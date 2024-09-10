const getHomePage = (req, res) => {
    console.log(req.user);
    res.render('home', { pageTitle: 'File Uploader', user: req.user });
}

module.exports = {
    getHomePage,
}