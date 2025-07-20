import {
  sanitizeString,
  validatePassword,
  validateEmail,
  validateSecureUrl,
  validateUserInput,
  validateAndSanitizeInput,
  SECURITY_CONFIG,
} from '../security';

describe('Security Utils', () => {
  describe('sanitizeString', () => {
    it('should remove dangerous HTML tags', () => {
      const input = '<script>alert("xss")</script>Hello';
      const result = sanitizeString(input);
      expect(result).toBe('Hello');
    });

    it('should remove javascript protocol', () => {
      const input = 'javascript:alert("xss")';
      const result = sanitizeString(input);
      expect(result).toBe('alert("xss")');
    });

    it('should remove event handlers', () => {
      const input = 'onclick=alert("xss")';
      const result = sanitizeString(input);
      expect(result).toBe('alert("xss")');
    });

    it('should preserve safe text', () => {
      const input = 'Hello World 123';
      const result = sanitizeString(input);
      expect(result).toBe('Hello World 123');
    });
  });

  describe('validatePassword', () => {
    it('should validate strong password', () => {
      const password = 'StrongPass123!';
      const result = validatePassword(password);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject weak password', () => {
      const password = 'weak';
      const result = validatePassword(password);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should require minimum length', () => {
      const password = 'Abc1!';
      const result = validatePassword(password);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(`La contraseña debe tener al menos ${SECURITY_CONFIG.PASSWORD_MIN_LENGTH} caracteres`);
    });
  });

  describe('validateEmail', () => {
    it('should validate correct email', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('should reject invalid email', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
    });
  });

  describe('validateSecureUrl', () => {
    it('should validate secure URLs', () => {
      expect(validateSecureUrl('https://example.com')).toBe(true);
      expect(validateSecureUrl('http://localhost:3000')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(validateSecureUrl('not-a-url')).toBe(false);
      expect(validateSecureUrl('ftp://example.com')).toBe(false);
    });
  });

  describe('validateUserInput', () => {
    it('should accept safe input', () => {
      expect(validateUserInput('Hello World')).toBe(true);
      expect(validateUserInput('123456')).toBe(true);
    });

    it('should reject dangerous input', () => {
      expect(validateUserInput('<script>alert("xss")</script>')).toBe(false);
      expect(validateUserInput('javascript:alert("xss")')).toBe(false);
      expect(validateUserInput('onclick=alert("xss")')).toBe(false);
    });

    it('should reject input that is too long', () => {
      const longInput = 'a'.repeat(1001);
      expect(validateUserInput(longInput)).toBe(false);
    });
  });

  describe('validateAndSanitizeInput', () => {
    it('should sanitize and validate safe input', () => {
      const result = validateAndSanitizeInput('Hello World');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('Hello World');
      }
    });

    it('should sanitize dangerous input', () => {
      const result = validateAndSanitizeInput('<script>alert("xss")</script>Hello');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('Hello');
      }
    });

    it('should reject empty input', () => {
      const result = validateAndSanitizeInput('');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('El texto no puede estar vacío');
      }
    });
  });
}); 