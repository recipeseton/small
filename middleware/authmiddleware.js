const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
            if(err){
                res.redirect('/login');
            }
            else{
                next();
            }
        })
    }
    else{
        res.redirect('/login');
    }
}

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, 'my secret key goes here', async (err, decodedToken) => {
            if(err){
                res.status(404).redirect('/login');
                next();
            }
            else{
                let user = await User.findById(decodedToken.id);
                res.status(200).json(user);
                next();
            }
        })
    }
    else {
        res.status(404).json({});
        next();
    }
}

module.exports = {requireAuth, checkUser};
