import nodemailer from 'nodemailer'
import path from 'path'
import hbs from 'nodemailer-express-handlebars'
import dotenv from 'dotenv'

dotenv.config()

const transporter = nodemailer.createTransport({
    service: process.env.SERVICE_MAIL,
    host: process.env.HOST_MAIL,
    port: process.env.PORT_MAIL,
    secure: false,
    auth: {
        user: process.env.USER_MAIL,
        pass: process.env.PASS_MAIL
    },
    pool: true,
})

const mailOptions = {
    from: 'FeriaInnovacion <noreply@feriainnovacion.gob.ve>',
    to: `${process.env.USER_MAIL}`,
    subject: "Hello ✔️",
    text: "Hello world?",
    html: "<b> Hello World? </b>"
}

const handlebarOptions = {
    viewEngine: {
        extName: ".handlebars",
        partialsDir: path.resolve('./src/utils/views'),
        defaultLayout: false,
    },
    viewPath: path.resolve('./src/utils/views'),
    extName: ".handlebars",
}

transporter.use('compile', hbs(handlebarOptions));

export const sendMail = async (email, link, message,  button) => {
    console.log(message)

    const mailOptions = {
        from: 'Confirmar <noreply@feriainnovacion.gob.ve>',
        to: email,
        subject: "Confirmacion de registro",
        template: 'email',
        context: {
            button: button,
            message: message,
            link: link
        }
    }

    try {
        await transporter.sendMail(mailOptions)
        console.log("mail sent successfully")
    } catch (error) {
        console.log(error)
    }
}
