const User = require('../models/User');
const Company = require('../models/Company');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;
const MAX_AGE = 3 * 24 * 60 * 60;

const handleErrors = (err) => {
    let errors = { email: '', password: ''};

    if(err.message === 'Incorrect Email Address' || err.message === 'Incorrect Password'){
        errors.email = 'Either or both email address and password is incorrect'
        errors.password = 'Either or both email address and password is incorrect'
    }

    if(err.code === 11000){
        errors.email = 'This email address is already registered';
        return errors;
    }

    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        })
    }
    return errors;
}

const createToken = (id) => {
    return jwt.sign({id}, SECRET_KEY, {
        expiresIn: MAX_AGE
    });
}

module.exports.signupGet = (req, res ) => {
    res.json('sign up');
}

module.exports.companySignupGet = (req, res) => {
    res.json('company sign up');
}

module.exports.signupPost = async (req, res ) => {
    const {firstname, lastname, email, password, joinedOn, verified, avatar, company, following, posts} = req.body;
    try{
        const newUser = await User.create({firstname, lastname, email, password, joinedOn, verified, avatar, company, following, posts});
        const token = createToken(newUser._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: MAX_AGE * 1000 });
        res.status(201).json({user: newUser._id});
    } 
    catch(err) {
        const errors = handleErrors(err);
        res.status(400).json(errors);
    }
}

module.exports.companySignupPost = async (req, res) => {
    const { name, _name, email, password, location, industry, description, phone, rc_number, joinedOn, verified, logo, employees, posts, followers, products } = req.body;
    try{
        const newCompany = await Company.create({ name, _name, email, password, location, industry, description, phone, rc_number, joinedOn, verified, logo, employees, posts, followers, products });
        const token = createToken(newCompany._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: MAX_AGE * 1000 });
        res.status(201).json({company: newCompany._id});
    } 
    catch(err) {
        const errors = handleErrors(err);
        res.status(400).json(errors);
    }
}

module.exports.loginGet = (req, res ) => {
    res.json('login Page')
}

module.exports.companyLoginGet = (req, res ) => {
    res.json('company login Page')
}

module.exports.loginPost = async (req, res ) => {
    const {email, password} = req.body;
    try{
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: MAX_AGE * 1000 });
        res.status(200).json({user: user._id});
    }
    catch(err){
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports.companyLoginPost = async (req, res ) => {
    const {email, password} = req.body;
    try{
        const company = await Company.login(email, password);
        const token = createToken(company._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: MAX_AGE * 1000 });
        res.status(200).json({company: company._id});
    }
    catch(err){
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports.logoutGet = (req, res) => {
    res.cookie('jwt', '', {maxAge: 1});
    res.redirect('/');
}

