import nodemailer from 'nodemailer';
import { resolve } from 'path';
import expressHBS from 'express-handlebars';
import mailerHBS from 'nodemailer-express-handlebars';
import MailSettings from '../settings/mail';

class Mail {
  constructor() {
    const { host, port, secure, auth } = MailSettings;

    this.transport = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null,
    });

    this.configureTemplates();
  }

  configureTemplates() {
    const viewPath = resolve(__dirname, '..', 'app', 'views', 'email');

    this.transport.use(
      'compile',
      mailerHBS({
        viewEngine: expressHBS.create({
          layoutsDir: resolve(viewPath, 'layout'),
          partialsDir: resolve(viewPath, 'partial'),
          defaultLayout: 'default',
          extname: '.hbs',
        }),
        viewPath,
        extName: '.hbs',
      })
    );
  }

  sendMail(message) {
    return this.transport.sendMail({
      ...MailSettings.default,
      ...message,
    });
  }
}

export default new Mail();
