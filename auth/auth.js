module.exports = (req, res, next) => {
    if (!req.session.loggedin) {
        res.redirect('/login');
    } else {
        next();
    }
}