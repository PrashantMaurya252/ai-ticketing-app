import nodemailer from 'nodemailer'

export const sendMail = async(to,subject,text)=>{
    try {
        const transporter = nodemailer.createTransport({
            host:process.env.MAILTRAP_SMTP_HOST,
            port:process.env.MAILTRAP_SMTP_PORT,
            secure:false,
            auth:{
                user:process.env.MAILTRAP_SMTP_USER,
                pass:process.env.MAILTRAP_SMTP_PASS
            }
        })
    } catch (error) {
        
    }
}