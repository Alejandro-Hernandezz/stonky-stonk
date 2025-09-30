import express from 'express';
import AuthController from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';
import { 
  validate, 
  registerSchema, 
  loginSchema, 
  requestResetSchema, 
  resetPasswordSchema 
} from '../utils/validators.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiters específicos (RNF-09)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.LOGIN_RATE_LIMIT_MAX) || 5,
  message: {
    success: false,
    message: 'Demasiados intentos de inicio de sesión. Por favor, intenta de nuevo en 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3,
  message: {
    success: false,
    message: 'Demasiados intentos de registro. Por favor, intenta de nuevo más tarde.'
  }
});

const resetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 3,
  message: {
    success: false,
    message: 'Demasiadas solicitudes de recuperación. Por favor, intenta de nuevo en 15 minutos.'
  }
});

// Rutas públicas
router.post(
  '/register',
  registerLimiter,
  validate(registerSchema),
  AuthController.register
);

router.post(
  '/login',
  loginLimiter,
  validate(loginSchema),
  AuthController.login
);

router.get(
  '/verify-email/:token',
  AuthController.verifyEmail
);

router.post(
  '/request-password-reset',
  resetLimiter,
  validate(requestResetSchema),
  AuthController.requestPasswordReset
);

router.post(
  '/reset-password',
  validate(resetPasswordSchema),
  AuthController.resetPassword
);

// Rutas protegidas (requieren autenticación)
router.get(
  '/me',
  authenticateToken,
  AuthController.getCurrentUser
);

router.post(
  '/logout',
  authenticateToken,
  AuthController.logout
);

export default router;