import express from  "express";
import cors from "cors";
const app =  express();


//basic configuration
app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit:"16kb" }));
app.use(express.static("public"));

import healthcheckRoutes from "./routes/healthcheck.routes.js";
import authRouter from "./routes/auth.routes.js";
app.use("/api/v1/healthcheck",healthcheckRoutes);
app.use("/api/v1/auth",authRouter);


app.use(cors({
    //origin is basically says wehere the frontend is 
    //in this case there mighht be mroe thatn one link to frontend page or 
    // by default in out project we gave https://localhost:5273
    origin: process.env.CORS_ORIGIN || "https://localhost:5173",
    credentials: true,
    //the types of methods acepted in  cross origin 
    methods: ['GET',"POST","PUT","PATCH","DELETE","OPTIONS"],
    allowedHeaders: ["Content-Type","Authorization"]
}))

app.get("/", (req,res) =>{
    res.send("Hello world");
})

app.get("/instagram", (req,res) =>{
    res.send("this is the isntagram page");
})


export default app;

