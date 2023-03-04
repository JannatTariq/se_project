const nodeMailer = require("nodemailer")

const sendEmail = async(options)=>{
    const transporter=nodeMailer.createTransport({
        service: 'gmail',
        host: process.env.SMPT_SERVICE,
        port: 465,
        secure:true,
        auth:{
            user:process.env.SMPT_MAIL,
            pass:process.env.SMPT_PASSWORD
        }
    })
    //var transporter = nodeMailer.createTransport(smtpConfig);
    const mailOptions={
        from:process.env.SMPT_MAIL,
        to:options.email,
        subject:options.subject,
        text:options.message
    };
    await transporter.sendMail(mailOptions);

}

module.exports = sendEmail