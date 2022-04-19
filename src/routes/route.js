const express = require('express');

const router = express.Router();

const userController=require("../controllers/UserController")
const taskController=require("../controllers/taskController")

//Authentication
 const Middleware=require("../middleware/Authentication");
const { route } = require('express/lib/application');


//user Api
router.post('/user',userController.resisterUser)
router.post('/login',userController.login)

//task Api
router.post('/createTask',taskController.createTask)
router.get('/gettask/:userId',Middleware.Auth,taskController.gettask) 
router.put('/task/:id',Middleware.Auth,taskController.updateTask)
router.delete('/task/:id',Middleware.Auth,taskController.DeletebyQuery)


module.exports = router;

