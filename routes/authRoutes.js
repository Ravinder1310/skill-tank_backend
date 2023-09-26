import express from "express"
import { LoginMiddleware, isCompany } from "../middleware/authMiddleware.js";
import { UserController, forgotPasswordController, loginController, registerController, updateProfileController } from "../controller/authController.js";

// router obj
const router = express.Router();

// routing
// Register || METHOD POST

router.post('/register',registerController);

// Login || METHOD POST

router.post('/login', loginController);

// forgot password

router.post('/forgot-password', forgotPasswordController)

// protected route auth

router.get('/user-auth',LoginMiddleware, (req,res) => {
    res.status(200).send({ok:true}); 
})

// get all users
router.get('/get-user',LoginMiddleware,isCompany, UserController)

// protected route auth

router.get('/admin-auth',LoginMiddleware,isCompany, (req,res) => {
    res.status(200).send({ok:true}); 
})

// update profile
router.put('/profile',LoginMiddleware, updateProfileController);


export default router;