import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/database.js';
import { helmetConfig, globalLimiter, sanitizeInput } from './middleware/security.js';
import authRoutes from './routes/authRoutes.js';
import Token from './models/Token.js';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const isDevelopment = process.env.NODE_ENV !== 'production';

// ========== MIDDLEWARE DE SEGURIDAD ==========
app.use(helmetConfig); // RNF-05, RNF-09
app.use(globalLimiter); // RNF-09

// ========== CORS ==========
const corsOptions = {
  origin: isDevelopment 
    ? process.env.CLIENT_URL || 'http://localhost:5173'
    : process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// ========== PARSEO DE BODY ==========
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ========== SANITIZACIÓN ==========
app.use(sanitizeInput); // RNF-07

// ========== LOGGING EN DESARROLLO ==========
if (isDevelopment) {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, {
      body: req.body,
      query: req.query,
      params: req.params
    });
    next();
  });
}

// ========== HEALTH CHECK ==========
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API StonkyStonk funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// ========== RUTAS ==========
app.use('/api/auth', authRoutes);

// TODO: Agregar más rutas según se vayan desarrollando
// app.use('/api/transactions', transactionRoutes);
// app.use('/api/goals', goalRoutes);
// app.use('/api/budgets', budgetRoutes);
// app.use('/api/reports', reportRoutes);

// ========== SERVIR FRONTEND EN PRODUCCIÓN ==========
if (!isDevelopment) {
  const path = await import('path');
  const { fileURLToPath } = await import('url');
  
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  
  const distPath = path.join(__dirname, '..', '..', 'client', 'dist');
  app.use(express.static(distPath));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// ========== MANEJO DE RUTAS NO ENCONTRADAS ==========
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// ========== MANEJO DE ERRORES GLOBAL ==========
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: isDevelopment ? err.message : 'Error interno del servidor',
    ...(isDevelopment && { stack: err.stack })
  });
});

// ========== INICIAR SERVIDOR ==========
const startServer = async () => {
  try {
    // Verificar conexión a la base de datos
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error('No se pudo conectar a la base de datos');
      process.exit(1);
    }

    // Limpiar tokens expirados al iniciar (RF01h)
    const deletedTokens = await Token.cleanExpired();
    console.log(`🗑️  Tokens expirados eliminados: ${deletedTokens}`);

    // Programar limpieza periódica de tokens cada 15 minutos
    setInterval(async () => {
      try {
        const deleted = await Token.cleanExpired();
        if (deleted > 0) {
          console.log(`🗑️  Limpieza automática: ${deleted} tokens eliminados`);
        }
      } catch (error) {
        console.error('Error en limpieza automática de tokens:', error);
      }
    }, 15 * 60 * 1000); // 15 minutos

    app.listen(PORT, () => {
      console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🚀 Servidor StonkyStonk iniciado correctamente     ║
║                                                       ║
║   📡 Puerto: ${PORT}                                     ║
║   🌍 Entorno: ${isDevelopment ? 'Desarrollo' : 'Producción'}                      ║
║   🔗 URL: http://localhost:${PORT}                    ║
║   📊 API: http://localhost:${PORT}/api                ║
║   ❤️  Health: http://localhost:${PORT}/api/health     ║
║                                                       ║
║   ${isDevelopment ? '🔧 Frontend: http://localhost:5173' : '📦 Sirviendo frontend desde /dist'}       ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Manejo de señales para cierre limpio
process.on('SIGTERM', () => {
  console.log('SIGTERM recibido, cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT recibido, cerrando servidor...');
  process.exit(0);
});

startServer();

export default app;