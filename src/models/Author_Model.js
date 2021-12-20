//
//{ fname: { mandatory}, lname: {mandatory}, title: {mandatory, enum[Mr, Mrs, Miss]}, email: {mandatory, valid email, unique}, password: {mandatory} }


const mongoose = require('mongoose')

const AuthorSchema = new mongoose.Schema({

    fname: {
        type: String,
        required: 'First name is required',
        trim: true,
    },
    lname: {
        type: String,
        required: 'Last name is required',
        trim: true,
    },
    title: {
        type: String,
        enum: ['Mr', 'Mrs', 'Miss'],
        required: 'Title is required',
        trim: true,
    },
    password: {
        type: String,
        required: 'Password is required',
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: {
            validator: function (email) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
            }, message: 'Please fill a valid email address', isAsync: false
        }
    }
    
 },{ timestamps: true })

module.exports = mongoose.model('AuthorsDB', AuthorSchema)