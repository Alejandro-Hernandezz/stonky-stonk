import nodemailer from 'nodemailer';

// Configurar transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true para 465, false para otros puertos
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Verificar configuración
transporter.verify((error) => {
  if (error) {
    console.error('❌ Error en configuración de email:', error);
  } else {
    console.log('✅ Servicio de email listo');
  }
});

class EmailService {
  // RF01b - Email de verificación
  static async sendVerificationEmail(email, token) {
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Verifica tu cuenta en StonkyStonk',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9fafb; padding: 30px; }
            .button { 
              display: inline-block; 
              background-color: #4F46E5; 
              color: white; 
              padding: 12px 30px; 
              text-decoration: none; 
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>¡Bienvenido a StonkyStonk!</h1>
            </div>
            <div class="content">
              <p>Hola,</p>
              <p>Gracias por registrarte en StonkyStonk. Para completar tu registro, por favor verifica tu correo electrónico haciendo clic en el siguiente botón:</p>
              <center>
                <a href="${verificationUrl}" class="button">Verificar mi correo</a>
              </center>
              <p>O copia y pega este enlace en tu navegador:</p>
              <p style="word-break: break-all; color: #4F46E5;">${verificationUrl}</p>
              <p>Este enlace expirará en 24 horas.</p>
              <p>Si no creaste esta cuenta, puedes ignorar este correo de forma segura.</p>
            </div>
            <div class="footer">
              <p>© 2025 StonkyStonk. Todos los derechos reservados.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`📧 Email de verificación enviado a: ${email}`);
      return true;
    } catch (error) {
      console.error('Error al enviar email de verificación:', error);
      throw new Error('No se pudo enviar el email de verificación');
    }
  }

  // RF01f - Email de reset de contraseña
  static async sendPasswordResetEmail(email, token) {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Recuperación de contraseña - StonkyStonk',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #DC2626; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9fafb; padding: 30px; }
            .button { 
              display: inline-block; 
              background-color: #DC2626; 
              color: white; 
              padding: 12px 30px; 
              text-decoration: none; 
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .warning { background-color: #FEF2F2; border-left: 4px solid #DC2626; padding: 15px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Recuperación de Contraseña</h1>
            </div>
            <div class="content">
              <p>Hola,</p>
              <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en StonkyStonk.</p>
              <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>
              <center>
                <a href="${resetUrl}" class="button">Restablecer Contraseña</a>
              </center>
              <p>O copia y pega este enlace en tu navegador:</p>
              <p style="word-break: break-all; color: #DC2626;">${resetUrl}</p>
              <p>Este enlace expirará en 1 hora por seguridad.</p>
              <div class="warning">
                <strong>⚠️ Importante:</strong> Si no solicitaste este cambio, ignora este correo. Tu contraseña actual permanecerá segura.
              </div>
            </div>
            <div class="footer">
              <p>© 2025 StonkyStonk. Todos los derechos reservados.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`📧 Email de reset de contraseña enviado a: ${email}`);
      return true;
    } catch (error) {
      console.error('Error al enviar email de reset:', error);
      throw new Error('No se pudo enviar el email de recuperación');
    }
  }

  // Email genérico para notificaciones futuras
  static async sendNotification(email, subject, message) {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            ${message}
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
            <p style="text-align: center; color: #666; font-size: 12px;">
              © 2025 StonkyStonk. Todos los derechos reservados.
            </p>
          </div>
        </body>
        </html>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`📧 Notificación enviada a: ${email}`);
      return true;
    } catch (error) {
      console.error('Error al enviar notificación:', error);
      throw new Error('No se pudo enviar la notificación');
    }
  }
}

export default EmailService