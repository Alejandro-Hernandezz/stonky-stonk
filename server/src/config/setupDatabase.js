import pool from './database.js';

const setupDatabase = async () => {
  const client = await pool.connect();
  
  try {
    console.log('Iniciando configuración de base de datos...');
    
    // Comenzar transacción
    await client.query('BEGIN');

    // Tabla de usuarios (RF01)
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        is_verified BOOLEAN DEFAULT FALSE,
        verification_token VARCHAR(255),
        verification_expires TIMESTAMP,
        reset_token VARCHAR(255),
        reset_expires TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Tabla users creada');

    // Tabla de tokens JWT (RF01d, RF01g, RF01h)
    await client.query(`
      CREATE TABLE IF NOT EXISTS jwt_tokens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token TEXT NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP NOT NULL
      );
    `);
    console.log('Tabla jwt_tokens creada');

    // Índices para mejorar rendimiento
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_jwt_tokens_user_id ON jwt_tokens(user_id);
      CREATE INDEX IF NOT EXISTS idx_jwt_tokens_token ON jwt_tokens(token);
      CREATE INDEX IF NOT EXISTS idx_jwt_tokens_expires_at ON jwt_tokens(expires_at);
    `);
    console.log('Índices creados');

    // Trigger para auto-limpieza de tokens expirados (RF01h)
    await client.query(`
      CREATE OR REPLACE FUNCTION delete_expired_tokens()
      RETURNS void AS $$
      BEGIN
        DELETE FROM jwt_tokens WHERE expires_at < NOW();
      END;
      $$ LANGUAGE plpgsql;
    `);
    console.log('Función de limpieza de tokens creada');

    // Nota: PostgreSQL no tiene EVENT SCHEDULER como MySQL
    // Se recomienda usar pg_cron o un cron job del sistema
    console.log('Para limpieza automática, configura pg_cron o usa cron del sistema:');
    console.log('   */15 * * * * psql -U postgres -d stonkystonk -c "SELECT delete_expired_tokens();"');

    // Función para actualizar updated_at automáticamente
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await client.query(`
      DROP TRIGGER IF EXISTS update_users_updated_at ON users;
      CREATE TRIGGER update_users_updated_at
      BEFORE UPDATE ON users
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    `);
    console.log('Trigger de updated_at creado');

    // Commit transacción
    await client.query('COMMIT');
    console.log('Base de datos configurada exitosamente');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al configurar la base de datos:', error);
    throw error;
  } finally {
    client.release();
    pool.end();
  }
};

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  setupDatabase()
    .then(() => {
      console.log('Setup completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Setup falló:', error);
      process.exit(1);
    });
}

export default setupDatabase;