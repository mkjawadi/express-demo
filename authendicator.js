function authendicate(req, res, next){
    console.log('Authendicating...');
    next();
}

module.exports = authendicate;