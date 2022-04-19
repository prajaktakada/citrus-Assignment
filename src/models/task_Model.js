const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    // task_attachmen:{type: String},
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userDB',
        required: true
    },
    duedate:
    {
        type: Date,
        default: null
    },
    
    isDeleted:{type:Boolean,default:false}

}, { timestamps: true })

module.exports = mongoose.model('taskDB', taskSchema)



