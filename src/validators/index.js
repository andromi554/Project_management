import {body} from "express-validator";

const userRegisteredValidators = ()=>{
    return [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Email is invalid"),
        body("username")
            .trim()
            .notEmpty()
            .withMessage("Username is required")
            .isLowercase()
            .withMessage("Username must be lower case")
            .isLength({min:3})
            .withMessage("Username must be atleast 3 characters"),
        body("password")
            .trim()
            .notEmpty()
            .withMessage("Password is required"),
        body("fullName")
            .optional()
            .trim()


    ]
}

const userLoginValidators = () =>{
    return [
        body("email")
            .optional()
            .isEmail()
            .withMessage("Email is not valid"),
        body("password")
            .notEmpty()
            .withMessage("Password is required")
    ]
}
export {userRegisteredValidators,userLoginValidators}