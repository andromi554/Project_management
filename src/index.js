import dotenv from "dotenv";
import connectDB from "./db/index.js"
import app from "./app.js"

dotenv.config({
  path: "./.env",
});


const port = process.env.PORT || 3000

connectDB()
  .then( ()=>{
    app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
  })

  })
  .catch((error)=> {
    console.log("Mongo Connection error", error);
    process.exit(1);
  })




import "dotenv/config";
console.log({
    host: process.env.MAILTRAP_SMTP_HOST,
    port: process.env.MAILTRAP_SMTP_PORT,
    user: process.env.MAILTRAP_SMTP_USER,
    pass: process.env.MAILTRAP_SMTP_PASS ? "LOADED" : "MISSING"
});