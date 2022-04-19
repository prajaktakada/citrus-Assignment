const taskModel = require("../models/task_Model")
const userModel = require("../models/User_Model")
const upload = require('../controllers/AWSController')


const isValid = function (value) {
    if (typeof value === 'undefined' || value === null ) return false
    if (typeof value === 'string'  && value.trim().length === 0) return false
    return true;
}

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}

const createTask = async function (req, res) {
    try {
        const requestBody = req.body
        let files = req.files;

        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide intern details' })
        }

        // if (files && files.length > 0) {
        //     var uploadedFileURL = await upload.uploadFile(files[0]);
        // } else {
        //     res.status(400).send({ status: false, message: "nothing to write" })
        // } 

        //extract params
        let { title, userId, duedate} = requestBody;

        
           //validation starts
         if (!isValid(title)) {
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide valid title' })
        }

        if (!isValid(userId)) {
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide valid userId' })
        }
        
        const searchUserId = await userModel.findOne({ _id: userId })
        if (!searchUserId) {
            return res.status(400).send({ status: false, message: 'UserId does not exist' })
        }

         if (!isValid(duedate)) {
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide valid duedate' })
        }

        //  const taskData = {title,userId,task_attachmen:uploadedFileURL,duedate}
        const taskData = {title,userId,duedate}


        let savedtask = await taskModel.create(taskData)
        res.status(201).send({ status: true, data: savedtask })
    }
    catch (err) {
        res.status(500).send({ status:false,message: err.message})
    }
}



//GET /user/:userId
const gettask = async function (req, res) {
    try {
        let decodedtokenUserId = req.user
        const userId = req.params.userId
// console.log(decodedtokenUserId.userId)
// console.log(userId)

        if (!(isValid(userId))) {
            return res.status(400).send({ status: false, message: 'Please provide valid userId' })
        }
 
        const searchUserId = await taskModel.findOne({ userId: userId })
        // console.log(searchUserId)
        if (!searchUserId) {
            return res.status(404).send({ status: false, message: 'UserId does not exist' })
        }

        console.log(decodedtokenUserId.userId === userId)
        if (!(decodedtokenUserId.userId === userId)) {
            res.status(400).send({ status: false, message: "userId in url param and in token is not same" })
        }
        
        res.status(200).send({ status: true, message: "task List", data: searchUserId })
    } catch (error) {

        return res.status(500).send({ success: false, error: error.message });
    }
}


//PUT /task/:id
const updateTask = async function (req, res) {
    try {
        const requestbody= req.body
        //const profileImage = req.files
        let decodedUserToken = req.user;

        if (!isValidRequestBody(requestbody)) {
            return res.status(400).send({ status: false, message: 'No paramateres passed. Book unmodified' })
        }
        
        let taskId = await taskModel.findOne({ _id: req.params.id });
        
        if (!taskId) {
            return res.status(404).send({ status: false, message: `User not found with given taskId` })
        }

    
        console.log(decodedUserToken.userId == taskId.userId)
        if (!(decodedUserToken.userId === taskId.userId)) {
            res.status(400).send({ status: false, message: "userId in url param and in token is not same" })
        }
      

        // if (profileImage && profileImage.length > 0) {
        //     var uploadedFileURL = await upload.uploadFile(profileImage[0]);
        //     console.log(uploadedFileURL)
        //     requestbody.profileImage = uploadedFileURL
        // };


        //extract params
        let { title,duedate} = requestbody;

        //validation starts
        if (!isValid(title)) {
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide valid title' })
        }

        if (!isValid(duedate)) {
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide valid duedate' })
        }

        // const UpdateData = { title, task_attachmen: uploadedFileURL, userId, duedate}
        const UpdateData = { title,duedate}


        const upatedT= await taskModel.findOneAndUpdate({_id:taskId._id}, UpdateData, { new: true })
          res.status(200).send({ status: true, message: 'updated successfully', data: upatedT });

            
    } catch (err) {
        res.status(500).send({ status: false, message: err.message });
    }
};



const DeletebyQuery = async function (req, res) {
    try {
        console.log(req.params.id)
        console.log(req.user.userId)
        if (req.user.userId == req.params.id) {
            let info = req.query
            let taskbody = await taskModel.findOne(info)
            let tempdata = await taskModel.findOneAndUpdate({ userId: taskbody.userId, isDeleted: false }, { isDeleted: true, deletedAt: Date() },{ new: true })
           //console.log(tempdata)
            if (tempdata) {

                res.status(200).send({status:true,data:tempdata})
            } else {
                res.status(404).send({ err: "data might have been already deleted" })
            }
        } else {
            res.status(404).send({ err: "you are trying to access a different's account" })
        }
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = {createTask,gettask,updateTask,DeletebyQuery}




