import bcrypt from 'bcrypt';
import { query } from '../config/database.js';
import crypto from 'crypto';

class User {
  // RF01a - Crear usuario
  static async create({ email, password }) {
    const passwordHash = await bcrypt.hash(
      password, 
      parseInt(process.env.BCRYPT_ROUNDS) || 12
    );
    
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(
      Date.now() + 
      (parseInt(process.env.EMAIL_VERIFICATION_EXPIRES_HOURS) || 24) * 60 * 60 * 1000
    );

    const result = await query(
      `INSERT INTO users (email, password_hash, verification_token, verification_expires) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, email, is_verified, created_at`,
      [email, passwordHash, verificationToken, verificationExpires]
    );

    return {
      user: result.rows[0],
      verificationToken
    };
  }

  // RF01c - Encontrar usuario por email
  static async findByEmail(email) {
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  }

  // RF01c - Verificar contraseña
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // RF01b - Verificar email del usuario
  static async verifyEmail(token) {
    const result = await query(
      `UPDATE users 
       SET is_verified = TRUE, 
           verification_token = NULL, 
           verification_expires = NULL 
       WHERE verification_token = $1 
         AND verification_expires > NOW()
       RETURNING id, email, is_verified`,
      [token]
    );
    return result.rows[0];
  }

  // RF01f - Generar token de reset de contraseña
  static async generatePasswordResetToken(email) {
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(
      Date.now() + 
      (parseInt(process.env.PASSWORD_RESET_EXPIRES_MINUTES) || 60) * 60 * 1000
    );

    const result = await query(
      `UPDATE users 
       SET reset_token = $1, reset_expires = $2 
       WHERE email = $3 
       RETURNING id, email`,
      [resetToken, resetExpires, email]
    );

    return {
      user: result.rows[0],
      resetToken
    };
  }

  // RF01f - Resetear contraseña
  static async resetPassword(token, newPassword) {
    const passwordHash = await bcrypt.hash(
      newPassword,
      parseInt(process.env.BCRYPT_ROUNDS) || 12
    );

    const result = await query(
      `UPDATE users 
       SET password_hash = $1, 
           reset_token = NULL, 
           reset_expires = NULL 
       WHERE reset_token = $2 
         AND reset_expires > NOW()
       RETURNING id, email`,
      [passwordHash, token]
    );

    return result.rows[0];
  }

  // Buscar usuario por ID
  static async findById(id) {
    const result = await query(
      'SELECT id, email, is_verified, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  // Eliminar usuario (para desarrollo/testing)
  static async delete(id) {
    const result = await query(
      'DELETE FROM users WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows[0];
  }
}

export default User;