const mongoose = require('mongoose');
const { isEmail, isAlphanumeric, isAlpha } = require('validator');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, 'Please, enter a valid name'],
        lowercase: true,
        minlength: [2, 'Name must have a minimum length of 2'],
        validate: [isAlpha, 'Name can only contain alphabets']
    },
    lastname: {
        type: String,
        required: [true, 'Please, enter a valid name'],
        lowercase: true,
        minlength: [2, 'Name must have a minimum length of 2'],
        validate: [isAlpha, 'Name can only contain alphabets']
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
    joinedOn: {
        type: Date,
        default: Date.now
    },
    verified: {
        type: Boolean,
        default: false
    },
    avatar: {
        type: String,
        default: 'default_user.png'
    }, 
    company: {type: Schema.ObjectId},
    following: [Schema.ObjectId],
    posts: [Schema.ObjectId]
})

userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if(user){
        const auth = await bcrypt.compare(password, user.password);
        if(auth){
            return user;
        }
        throw Error('Incorrect Password');
    }
    throw Error('Incorrect Email Address')

}

const User = mongoose.model('user', userSchema);
module.exports = User;