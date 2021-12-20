const jwt = require("jsonwebtoken")

const Auth = async function (req, res, next) {
    try {

        let token = req.headers['x-api-key']

            if(!token) {
                res.status(403).send({status: false, message: `Missing authentication token in request`})
                return;
            }
    
            let decoded = jwt.verify(token, "Group4")

            if(!decoded) {
                res.status(403).send({status: false, message: `Invalid authentication token in request`})
                return;
            }

            req.authorId = decoded.authorId;

            next()
        } catch (error) {
            console.error(`Error! ${error.message}`)
            res.status(500).send({status: false, message: error.message})
        }
    }
    

        
module.exports.Auth = Auth