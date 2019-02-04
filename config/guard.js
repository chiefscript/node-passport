module.exports = {
    authGuard : function (req, res, next) {
        if (req.isAuthenticated) {
            return next();
        }
        req.flash('error_message', 'Login to view this page.');
        res.redirect('/auth/login');
    }
}