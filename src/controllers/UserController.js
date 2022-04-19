
const userModel = require("../models/User_Model")
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")


const isValid = function (value) {
    if (typeof value === 'undefined' || value === null ) return false
    if (typeof value === 'string'  && value.trim().length === 0) return false
    return true;
}

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}

const resisterUser = async function (req, res) {
    try {
        const requestBody = req.body

        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide intern details' })
        }

        //extract params
        let { name, email, password} = requestBody;

           //validation starts
         if (!isValid(name)) {
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide valid name' })
        }

        if (!isValid(email)) {
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide valid email' })
        }
         email = email.trim();

         if (!isValid(password)) {
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide valid password' })
        }

        const userData = {name,email,password}

        // generate salt to hash password
        const salt = await bcrypt.genSalt(10);
        // now we set user password to hashed password
        userData.password = await bcrypt.hash(userData.password, salt);

        let saveduser = await userModel.create(userData)
        res.status(201).send({ status: true, data: saveduser })
    }
    catch (err) {
        res.status(500).send({ status:false,message: err.message})
    }
}


// login
const login = async function (req, res) {
    try {
        const requestBody = req.body

        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'value in request body is required' })
            return
        }

        let email = req.body.email
        let password = req.body.password

        if (!isValid(email)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide valid email' })
            return
        }

        if (!isValid(password)) {
            res.status(400).send({ status: false, message: 'password must be present' })
            return
        }

        if (email && password) {

            let User = await userModel.findOne({ email:email })

                const passvalid = await bcrypt.compare(password,User.password)
                const Token = jwt.sign({
                    userId: User._id,
                }, "pk")
                res.header('x-api-key', Token)

                res.status(200).send({ status: true, msg: "User login successfull", data: { userId: User._id, Token: Token } })
            } else {
                res.status(400).send({ status: false, Msg: "Invalid Credentials" })
            }  
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


module.exports = {resisterUser,login}


