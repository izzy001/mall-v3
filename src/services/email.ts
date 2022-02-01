import axios from 'axios'
import fs from 'fs'
import path from 'path'
import handlebars from 'handlebars'

const emailTemplateSource = fs.readFileSync(path.join(__dirname, '/src/templates/welcome.hbs'), "utf8")

const template = handlebars.compile(emailTemplateSource)

const  sterlingMail = 'https://pass.sterling.ng/Notifier/api/Notifier/notify'

export interface EmailOptions {
  sender: string
  email: string
  subject: string
  message: string
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    await axios.post(sterlingMail, options)
  } catch (err) {
    throw new Error(err)
  }
}
