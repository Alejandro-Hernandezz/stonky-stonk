import User from '../models/User.js';
import Token from '../models/Token.js';
import EmailService from '../services/emailService.js';

class AuthController {
  // RF01a - Registro de usuario
  static async register(req, res) {
    try {
      const { email, password } = req.validatedBody;

      // Verificar si el usuario ya existe
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Este correo electrónico ya está registrado'
        });
      }

      // Crear usuario
      const { user, verificationToken } = await User.create({ email, password });

      // RF01b - Enviar email de verificación
      try {
        await EmailService.sendVerificationEmail(email, verificationToken);
      } catch (emailError) {
        console.error('Error al enviar email:', emailError);
        // No fallar el registro si el email falla
      }

      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente. Revisa tu correo para verificar tu cuenta.',
        data: {
          id: user.id,
          email: user.email,
          isVerified: user.is_verified
        }
      });
    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({
        success: false,
        message: 'Error al registrar usuario'
      });
    }
  }

  // RF01b - Verificar email
static async verifyEmail(req, res) {
  try {
    const { token } = req.params;

    const user = await User.verifyEmail(token);

    if (!user) {
      // Redirigir al frontend con error
      return res.redirect(`${process.env.CLIENT_URL}/verification-failed`);
    }

    // Redirigir al frontend con éxito
    return res.redirect(`${process.env.CLIENT_URL}/verification-success`);
  } catch (error) {
    console.error('Error en verificación:', error);
    return res.redirect(`${process.env.CLIENT_URL}/verification-error`);
  }
}

  // RF01c - Login
  static async login(req, res) {
    try {
      const { email, password } = req.validatedBody;

      // Buscar usuario
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Correo o contraseña incorrectos'
        });
      }

      // Verificar contraseña
      const isValidPassword = await User.verifyPassword(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Correo o contraseña incorrectos'
        });
      }

      // Verificar que el email esté verificado
      if (!user.is_verified) {
        return res.status(403).json({
          success: false,
          message: 'Debes verificar tu correo electrónico antes de iniciar sesión'
        });
      }

      // RF01d - Crear token JWT
      const token = await Token.create(user.id);

      res.json({
        success: true,
        message: 'Inicio de sesión exitoso',
        data: {
          user: {
            id: user.id,
            email: user.email,
            isVerified: user.is_verified
          },
          token
        }
      });
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({
        success: false,
        message: 'Error al iniciar sesión'
      });
    }
  }

  // RF01g - Logout
  static async logout(req, res) {
    try {
      const token = req.token;

      await Token.delete(token);

      res.json({
        success: true,
        message: 'Sesión cerrada exitosamente'
      });
    } catch (error) {
      console.error('Error en logout:', error);
      res.status(500).json({
        success: false,
        message: 'Error al cerrar sesión'
      });
    }
  }

  // RF01f - Solicitar reset de contraseña
  static async requestPasswordReset(req, res) {
    try {
      const { email } = req.validatedBody;

      const user = await User.findByEmail(email);
      
      // Por seguridad, siempre responder con éxito aunque el email no exista
      if (!user) {
        return res.json({
          success: true,
          message: 'Si el correo existe, recibirás instrucciones para restablecer tu contraseña'
        });
      }

      const { resetToken } = await User.generatePasswordResetToken(email);

      try {
        await EmailService.sendPasswordResetEmail(email, resetToken);
      } catch (emailError) {
        console.error('Error al enviar email de reset:', emailError);
        return res.status(500).json({
          success: false,
          message: 'Error al enviar el correo de recuperación'
        });
      }

      res.json({
        success: true,
        message: 'Si el correo existe, recibirás instrucciones para restablecer tu contraseña'
      });
    } catch (error) {
      console.error('Error en solicitud de reset:', error);
      res.status(500).json({
        success: false,
        message: 'Error al procesar la solicitud'
      });
    }
  }

  // RF01f - Resetear contraseña
  static async resetPassword(req, res) {
    try {
      const { token, password } = req.validatedBody;

      const user = await User.resetPassword(token, password);

      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Token de recuperación inválido o expirado'
        });
      }

      // Eliminar todos los tokens activos del usuario por seguridad
      await Token.deleteAllByUser(user.id);

      res.json({
        success: true,
        message: 'Contraseña restablecida exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.'
      });
    } catch (error) {
      console.error('Error en reset de contraseña:', error);
      res.status(500).json({
        success: false,
        message: 'Error al restablecer contraseña'
      });
    }
  }

  // Obtener información del usuario actual
  static async getCurrentUser(req, res) {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      res.json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          isVerified: user.is_verified,
          createdAt: user.created_at
        }
      });
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener información del usuario'
      });
    }
  }
}

export default AuthController;