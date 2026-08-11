import {User} from "../models/user.model.js";
import {ApiResponse} from "../utils/api-response.js";
import {ApiError} from "../utils/api-error.js";
import {asyncHandler} from "../utils/async-handler.js";
import {sendEmail} from "../utils/mail.js";

const generateAccessandRefreshToken = async (userId) =>{
    try{
        const user =  await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refereshToken = user.generateRefereshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});
        return {accessToken,refreshToken}
    }
    catch(error){
        throw new ApiError (
            500,
            "Something went wrong while generating access Token and refresh token");
    };
    
};

const registerUser = asyncHandler(async(req,res) => {
    const {email, username,password,role} = req.body;

    const existedUser = await User.findOne({
        $or: [{email}, {username}]
    });

    if (existedUser){
        throw new ApiError(
            409,
            "User with that mail id and usernname already exists",[])
    }

    const user = await User.create({
        email,
        username,
        password,
        isEmailVerified:false
    })

    const {unhashedToken,hashedToken,tokenExpiry} = user.generateTemproraryToken();

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpiry = tokenExpiry;

    await user.save({validateBeforeSave: false});

    await sendEmail({
        email:user?.email,
        subject: "Please verify ur mail",
        mailgenContent: emailVerification(
            user.username,
            `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unhashedToken}`
        )
    });

    const createdUser  = await User.findById(user._id).select(
        "-password -refereshToken -emailVerificationToken -emailVerificationExpiry");

    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user");

    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                {
                    user: createdUser
                },
                "User registred successfully and verification email has been sent on your mail "
            )
        )

})