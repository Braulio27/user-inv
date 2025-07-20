import { z } from 'zod';

// Configuración de seguridad
export const SECURITY_CONFIG = {
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutos
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutos
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REQUIREMENTS: {
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  },
} as const;

// Función para sanitizar strings
export const sanitizeString = (input: string): string => {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remover script tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remover iframe tags
    .replace(/javascript:/gi, '') // Remover javascript:
    .replace(/on\w+\s*=/gi, '') // Remover event handlers
    .replace(/[<>]/g, ''); // Remover < y > restantes
};

// Función para validar contraseña segura
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < SECURITY_CONFIG.PASSWORD_MIN_LENGTH) {
    errors.push(`La contraseña debe tener al menos ${SECURITY_CONFIG.PASSWORD_MIN_LENGTH} caracteres`);
  }

  if (SECURITY_CONFIG.PASSWORD_REQUIREMENTS.uppercase && !/[A-Z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra mayúscula');
  }

  if (SECURITY_CONFIG.PASSWORD_REQUIREMENTS.lowercase && !/[a-z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra minúscula');
  }

  if (SECURITY_CONFIG.PASSWORD_REQUIREMENTS.numbers && !/\d/.test(password)) {
    errors.push('La contraseña debe contener al menos un número');
  }

  if (SECURITY_CONFIG.PASSWORD_REQUIREMENTS.symbols && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('La contraseña debe contener al menos un símbolo especial');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Función para generar token seguro
export const generateSecureToken = (length: number = 32): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const randomArray = new Uint8Array(length);
  crypto.getRandomValues(randomArray);
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(randomArray[i] % chars.length);
  }
  
  return result;
};

// Función para validar email
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Función para validar URL segura
export const validateSecureUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'https:' || urlObj.protocol === 'http:';
  } catch {
    return false;
  }
};

// Función para prevenir XSS
export const escapeHtml = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

// Función para validar entrada de usuario
export const validateUserInput = (input: string, maxLength: number = 1000): boolean => {
  if (!input || input.length > maxLength) {
    return false;
  }

  // Verificar caracteres peligrosos
  const dangerousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+=/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
  ];

  return !dangerousPatterns.some(pattern => pattern.test(input));
};

// Función para rate limiting (simulada para el frontend)
export class RateLimiter {
  private attempts: Map<string, { count: number; lastAttempt: number }> = new Map();

  isAllowed(key: string): boolean {
    const now = Date.now();
    const attempt = this.attempts.get(key);

    if (!attempt) {
      this.attempts.set(key, { count: 1, lastAttempt: now });
      return true;
    }

    // Reset si ha pasado el tiempo de bloqueo
    if (now - attempt.lastAttempt > SECURITY_CONFIG.LOCKOUT_DURATION) {
      this.attempts.set(key, { count: 1, lastAttempt: now });
      return true;
    }

    // Verificar límite de intentos
    if (attempt.count >= SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS) {
      return false;
    }

    // Incrementar contador
    this.attempts.set(key, { count: attempt.count + 1, lastAttempt: now });
    return true;
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }
}

// Esquema de validación para entrada de usuario
export const UserInputSchema = z.object({
  text: z
    .string()
    .max(1000, 'El texto no puede exceder 1000 caracteres')
    .refine(validateUserInput, 'El texto contiene caracteres no permitidos'),
});

// Función para validar y sanitizar entrada de usuario
export const validateAndSanitizeInput = (input: string): { success: true; data: string } | { success: false; error: string } => {
  try {
    const validated = UserInputSchema.parse({ text: input });
    const sanitized = sanitizeString(validated.text);
    return { success: true, data: sanitized };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0]?.message || 'Entrada inválida' };
    }
    return { success: false, error: 'Error de validación' };
  }
}; 