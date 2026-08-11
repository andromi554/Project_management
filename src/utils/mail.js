import mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendEmail = async (options) => {
    //initialize default brading
    const mailGenerator = new Mailgen({
        theme: "default",
        product: {
            name:"Task manager",
            link: "https://taskmanager.link.com"
        }
    })
    //based on the "options" we generate the mail
    const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);
    const emailHtml = mailGenerator.generate(options.mailgenContent);

    //semding the email  modile
    const transporter  = nodemailer.createTransport({
        host:process.env.MAILTRAP_SMTP_HOST,
        port:process.env.MAILTRAP_SMTP_PORT,
        auth:{
            user:process.env.MAILTRAP_SMTP_USER,
            pass:process.env.MAILTRAP_SMTP_PASS

        }


    })

    const mail = {
        from: "ExampleTeam <team@exmple.com>",
        to:options.email,
        subject:options.subject,
        text: emailTextual,
        html: emailHtml
    }
    try {
        await trasporter.sendMail(mail)
        
    }catch(error){
        console.error("Error while sending mail:", err);

    }

//for some useless reasons i copied the api key of mailtrap = "d053fd8d632ff9c08a6723f02a31b480"
    
}




const emailVerification = (username,verificationUrl) =>{
    return {
        body:{
            name: username,
            intro:"Welcome to our app we are exciteed to ahve you on board",
            action:{
                instructions: "To verify your email please click on the following buttons",
                button: {
                    color: "#1aae5aff",
                    text:"Verify your email",
                    link: verificationUrl
                },
                outro: "Need help or quastion  or have question...Just reply to this mail"
            }
        }
    }
}




const forgotPasswordVerification = (username,passwordResetUrl) =>{
    return {
        body:{
            name: username,
            intro:"we got a request ot reset the password of you account",
            action:{
                instructions: "To reset the password click the following button or link",
                button: {
                    color: "#1aae5aff",
                    text:"Reset password",
                    link: passwordResetUrl
                },
                outro: "Need help or quastion  or have question...Just reply to this mail"
            }
        }
    }
}

export {emailVerification, forgotPasswordVerification,sendEmail}

// two types of mail developemntal and production

