const mongoose = require('mongoose');
const { isEmail, isAlphanumeric, isNumeric } = require('validator');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema.Types;

const companySchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minlength:[2, 'Company name must be at least 2 characters']
    },
    _name:{
        type: String,
    },
    email: {
        type: String,
        required: [true, 'Please enter an email address'],
        unique: [true, 'Email address already exists!'],
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'Password must have at least 6 characters'],
        validate: [isAlphanumeric, 'Please enter a valid password'] 
    },
    location: {
        street: {type: String},
        apt: {type: String},
        city: {type: String},
        state: {type: String},
        zipCode: {type: String, minlength: [5, 'zip code must be at least 5 characters long']},
        coordinates: {
            longitude: {type: String},
            latitude: {type: String}
        }
    },
    industry: {
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    phone: {
        type: String,
        required: true,
        minlength: [10, 'Phone number must be at least 10 numbers'],
        validate: [isNumeric, 'Please enter a valid phone number']
    },
    rc_number: {
       type: String,
       minlength: [6, 'Registration Number must be at least 6 characters'],
       validate: [isNumeric, 'Registration Number must be numeric']
    },
    joinedOn: {
        type: Date,
        default: Date.now
    },
    verified: {
        type: Boolean,
        default: false
    },
    logo: {
        type: String,
        default: 'default_user.png'
    },
    employees: [ Schema.ObjectId],
    followers: [Schema.ObjectId],
    posts: [Schema.ObjectId],
    products: [Schema.ObjectId]
});

companySchema.pre('save', async function(next) {
    this._name = this.name.split(' ').join('-');
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

companySchema.statics.login = async function(email, password) {
    const company = await this.findOne({ email });
    if(company){
        const auth = await bcrypt.compare(password, company.password);
        if(auth){
            return company;
        }
        throw Error('Incorrect Password');
    }
    throw Error('Incorrect Email Address')

}

const Company = mongoose.model('company', companySchema);
module.exports = Company;