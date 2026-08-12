import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { sendEmail, emailVerification } from "../utils/mail.js";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while generating access token and refresh token",
            [],
            error.stack
        );
    }
};

const registerUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;

    const existedUser = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (existedUser) {
        throw new ApiError(409, "User with that email or username already exists", []);
    }

    const user = await User.create({
        email,
        username,
        password,
        isEmailVerified: false
    });

    const { unhashedToken, hashedToken, tokenExpiry } = user.generateTemproraryToken();

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpiry = tokenExpiry;

    await user.save({ validateBeforeSave: false });

    await sendEmail({
        email: user?.email,
        subject: "Please verify your email",
        mailgenContent: emailVerification(
            user.username,
            `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unhashedToken}`
        )
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"          
    );

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res.status(201).json(
        new ApiResponse(
            201,
            "User registered successfully and verification email has been sent to your mail",
            { user: createdUser }
        )
    );
});



const login = asyncHandler(async(req,res) =>{
    const {email,username,password} = req.body;

    if(!email || !username){
        throw new ApiError(
            400,
            "Useername or Email is required"
        )
    }


    const user = await User.findOne({
    $or: [{ email }, { username }]
});
    if (!user){
        throw new ApiError(400,"User does not exists");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new ApiError(400,"password is invalid");
    }

    const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id);

    const loggedInUser =await User.findById(user._id).select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry");

     const options = {
        httpOnly:true,
        secure:true
    }


    return res  
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .json(
            new ApiResponse(
                200,
                "User has logged in successfully",
                {
                    user:loggedInUser,
                    accessToken,
                    refreshToken
                }
                
            )
        )

   


})

export  {registerUser,login};