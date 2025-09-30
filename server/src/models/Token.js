import { query } from '../config/database.js';
import jwt from 'jsonwebtoken';

class Token {
  // RF01d - Crear y guardar token JWT
  static async create(userId) {
    const payload = { userId };
    const expiresIn = process.env.JWT_EXPIRES_IN || '24h';
    
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
    
    // Calcular fecha de expiración
    const expiresAt = new Date();
    const hours = parseInt(expiresIn) || 24;
    expiresAt.setHours(expiresAt.getHours() + hours);

    await query(
      'INSERT INTO jwt_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [userId, token, expiresAt]
    );

    return token;
  }

  // RF01e - Verificar si el token existe en la BD
  static async verify(token) {
    try {
      // Primero verificar firma y expiración
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Luego verificar que existe en la base de datos
      const result = await query(
        `SELECT t.*, u.id as user_id, u.email, u.is_verified 
         FROM jwt_tokens t 
         JOIN users u ON t.user_id = u.id 
         WHERE t.token = $1 AND t.expires_at > NOW()`,
        [token]
      );

      if (result.rows.length === 0) {
        return null;
      }

      return {
        userId: decoded.userId,
        user: result.rows[0]
      };
    } catch (error) {
      return null;
    }
  }

  // RF01g - Eliminar token (logout)
  static async delete(token) {
    const result = await query(
      'DELETE FROM jwt_tokens WHERE token = $1 RETURNING id',
      [token]
    );
    return result.rows[0];
  }

  // RF01g - Eliminar todos los tokens de un usuario
  static async deleteAllByUser(userId) {
    await query(
      'DELETE FROM jwt_tokens WHERE user_id = $1',
      [userId]
    );
  }

  // RF01h - Limpiar tokens expirados
  static async cleanExpired() {
    const result = await query(
      'DELETE FROM jwt_tokens WHERE expires_at < NOW() RETURNING id'
    );
    return result.rowCount;
  }

  // Obtener todos los tokens activos de un usuario
  static async findByUser(userId) {
    const result = await query(
      'SELECT token, created_at, expires_at FROM jwt_tokens WHERE user_id = $1 AND expires_at > NOW()',
      [userId]
    );
    return result.rows;
  }
}

export default Token;