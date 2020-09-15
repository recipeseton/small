const Company = require('../models/Company');
const jwt = require('jsonwebtoken');

module.exports.companyDetailsGet = (req, res) => {
    res.send(req.params);
}

module.exports.companyProductsGet = (req, res) => {
    res.send(req.params);
}

module.exports.companyProductGet = (req, res) => {
    res.send(req.params);
}

module.exports.companyPostsPost = (req, res) => {
    res.send(req.body);
}
