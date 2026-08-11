import { Timestamp } from "mongodb";
import mongoose , {Schema} from "mongoose";
import jwt from "jsonwebtoken";


const userSchema = new Schema({
    avatar:{
        type: {
            url: String,
            localPath: String
        },
        default:{
            url: "",
            localPath: ""
        }
    }   ,
    username:{
        type: String,
        unique: true,
        lowercase: true,
        index:true,
        trim: true,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique:true,
        trim: true
    },

    fullname:{
        type: String,
        trim: true
    },
    password:{
        type: String,
        required: [true, "Password is reuqired"]
    },
    isEmailVerified:{
        type: Boolean,
        default: false
    },
    refreshToken:{
        type: String
    },
    forgetPasswordToken:{
        type:String
    },
    forgetPasswordExpiry:{
        type:Date
    },
    emailVerificationToken:{
        type: String
    },
    emailVerificationExpiry:{
        type: Date
    }
},{
    timestamps: true
})


userSchema.pre("save", async function(next){
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,10);
    next()

})


userSchema.methods.isPasswordCorrect (async function(password){
    return bcrypt.compare(password,this.password);
})

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn : process.env.ACCESS_TOKEN_EXPIRY}
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH__TOKEN_SECRET,
        {expiresIn : process.env.REFRESH__TOKEN_EXPIRY}
    )
}

userSchema.methods.generateTemproraryToken = function(){
    const unhashedToken = crypto.randomBytes(20).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(unhashedToken).digest("hex");
    const tokenExpiry = Date.now() + (20 * 60 * 1000);
    return {unhashedToken,hashedToken,tokenExpiry};
}

const User = mongoose.model("User",userSchema)
export {User};