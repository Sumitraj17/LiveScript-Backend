import { Router } from "express";
import { userSignup,userLogin, userLogout } from "../controller/userController.js";
import verifyToken from "../middleware/auth.middleware.js";

const router = Router();

router.route('/').get((req,res)=>{
    res.send('Valid User routes');
})
router.route('/signup').post(userSignup)
router.route('/login').post(userLogin)
router.route('/logout').post(verifyToken,userLogout)

export default router