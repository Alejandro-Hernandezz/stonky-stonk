import Token from '../models/Token.js';

// RF01e - Middleware de autenticación
export const authenticateToken = async (req, res, next) => {
  try {
    // Obtener token del header Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado. Acceso denegado.'
      });
    }

    // Verificar token (firma y existencia en BD)
    const decoded = await Token.verify(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }

    // Verificar que el usuario esté verificado
    if (!decoded.user.is_verified) {
      return res.status(403).json({
        success: false,
        message: 'Debes verificar tu correo electrónico antes de continuar'
      });
    }

    // Agregar información del usuario al request
    req.user = {
      id: decoded.userId,
      email: decoded.user.email
    };
    req.token = token;

    next();
  } catch (error) {
    console.error('Error en middleware de autenticación:', error);
    return res.status(500).json({
      success: false,
      message: 'Error en la autenticación'
    });
  }
};

// Middleware opcional - No requiere autenticación pero agrega info si está presente
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = await Token.verify(token);
      if (decoded && decoded.user.is_verified) {
        req.user = {
          id: decoded.userId,
          email: decoded.user.email
        };
        req.token = token;
      }
    }

    next();
  } catch (error) {
    next();
  }
};