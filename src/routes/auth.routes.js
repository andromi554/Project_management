import { Router } from "express";
import  {registerUser,login}  from "../controllers/auth.controllers.js";
import {validate} from "../middlewares/validator.middleware.js";
import { userRegisteredValidators ,userLoginValidators} from "../validators/index.js";


const router = Router();
router.route("/register").post(userRegisteredValidators(),validate,registerUser);
router.route("/login").post(userLoginValidators(),login)

export default router;